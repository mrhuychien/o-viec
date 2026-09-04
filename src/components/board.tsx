import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StackCard } from "@/components/stack-card";
import { UserButton } from "@/lib/auth/gates";
import { getBoard, saveBoard } from "@/lib/board-api";
import {
  flushBoard,
  MAX_STACKS,
  MIN_STACKS,
  useBoardStore,
} from "@/lib/board-store";
import { LOCAL_BOARD_KEY, type Stack } from "@/lib/board-types";

function readLocalStacks(): Stack[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_BOARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { stacks?: Stack[] }; stacks?: Stack[] };
    const stacks = parsed.state?.stacks ?? parsed.stacks;
    if (!Array.isArray(stacks) || stacks.length === 0) return null;
    return stacks;
  } catch {
    return null;
  }
}

export function Board() {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const ready = useBoardStore((s) => s.ready);
  const stacks = useBoardStore((s) => s.stacks);
  const hydrate = useBoardStore((s) => s.hydrate);
  const addStack = useBoardStore((s) => s.addStack);
  const removeStack = useBoardStore((s) => s.removeStack);
  const renameStack = useBoardStore((s) => s.renameStack);
  const addTask = useBoardStore((s) => s.addTask);
  const toggleTask = useBoardStore((s) => s.toggleTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const clearDone = useBoardStore((s) => s.clearDone);

  useEffect(() => {
    let cancelled = false;
    void getBoard()
      .then(async (board) => {
        if (cancelled) return;
        if (board.isNew) {
          const local = readLocalStacks();
          if (local) {
            hydrate(local);
            localStorage.removeItem(LOCAL_BOARD_KEY);
            void saveBoard({ data: local }).catch(() => {});
            return;
          }
        }
        hydrate(board.stacks);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  useEffect(() => {
    const onHide = () => flushBoard();
    const onVis = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVis);
      flushBoard();
    };
  }, []);

  const remaining = stacks.reduce((n, s) => n + s.tasks.filter((t) => !t.done).length, 0);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex shrink-0 flex-col gap-2 bg-background/90 px-4 py-3 backdrop-blur-[2px] md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
        <div className="min-w-0">
          <h1 className="font-display text-4xl leading-none text-foreground md:text-5xl">
            Ô Việc
          </h1>
          <p className="mt-1 text-lg leading-snug text-muted-foreground">
            {ready ? `${stacks.length} ô · ${remaining} việc còn lại` : "Đang mở sổ…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="shrink-0"
            disabled={!ready || stacks.length >= MAX_STACKS}
            onClick={() => {
              const id = addStack();
              if (id) setFocusId(id);
            }}
          >
            <Plus className="size-5" />
            Thêm ô
          </Button>
          <div className="min-w-0 text-lg">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-4 pb-4 md:px-6 md:pb-6">
        {loadError ? (
          <p className="sheet rounded-lg px-5 py-8 text-xl">
            Không mở được sổ. Tải lại trang rồi thử lại.
          </p>
        ) : !ready ? (
          <div className="board-flow">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="sheet min-h-80 animate-pulse rounded-lg md:min-h-96" />
            ))}
          </div>
        ) : (
          <div className="board-flow">
            {stacks.map((stack) => (
              <StackCard
                key={stack.id}
                stack={stack}
                canRemove={stacks.length > MIN_STACKS}
                autoFocusTitle={focusId === stack.id}
                onRename={(title) => renameStack(stack.id, title)}
                onRemove={() => removeStack(stack.id)}
                onAddTask={(text) => addTask(stack.id, text)}
                onToggleTask={(taskId) => toggleTask(stack.id, taskId)}
                onDeleteTask={(taskId) => deleteTask(stack.id, taskId)}
                onClearDone={() => clearDone(stack.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
