import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StackCard } from "@/components/stack-card";
import { MAX_STACKS, MIN_STACKS, useBoardStore } from "@/lib/board-store";

export function Board() {
  const [focusId, setFocusId] = useState<string | null>(null);
  const stacks = useBoardStore((s) => s.stacks);
  const addStack = useBoardStore((s) => s.addStack);
  const removeStack = useBoardStore((s) => s.removeStack);
  const renameStack = useBoardStore((s) => s.renameStack);
  const addTask = useBoardStore((s) => s.addTask);
  const toggleTask = useBoardStore((s) => s.toggleTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const clearDone = useBoardStore((s) => s.clearDone);

  useEffect(() => {
    void useBoardStore.persist.rehydrate();
  }, []);

  const remaining = stacks.reduce((n, s) => n + s.tasks.filter((t) => !t.done).length, 0);
  const fitEight = stacks.length === 8;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-3 px-3 py-2.5 md:px-5 md:py-3">
        <div className="min-w-0">
          <p className="font-display text-xl leading-none font-medium tracking-tight italic md:text-2xl">
            Ô Việc
          </p>
          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
            {stacks.length} ô · {remaining} việc còn lại
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={stacks.length >= MAX_STACKS}
          onClick={() => {
            const id = addStack();
            if (id) setFocusId(id);
          }}
        >
          <Plus className="size-3.5" />
          Thêm ô
        </Button>
      </header>

      <main className="min-h-0 flex-1 px-3 pb-3 md:px-5 md:pb-4">
        <div className={fitEight ? "board-fit-8" : "board-flow"}>
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
      </main>
    </div>
  );
}
