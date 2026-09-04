import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskRow } from "@/components/task-row";
import type { Stack } from "@/lib/board-store";

type StackCardProps = {
  stack: Stack;
  canRemove: boolean;
  autoFocusTitle?: boolean;
  onRename: (title: string) => void;
  onRemove: () => void;
  onAddTask: (text: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onClearDone: () => void;
};

export function StackCard({
  stack,
  canRemove,
  autoFocusTitle,
  onRename,
  onRemove,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearDone,
}: StackCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(stack.title);
  const [draft, setDraft] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);

  const open = stack.tasks.filter((t) => !t.done);
  const done = stack.tasks
    .filter((t) => t.done)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  useEffect(() => {
    setTitle(stack.title);
  }, [stack.title]);

  useEffect(() => {
    if (autoFocusTitle) {
      setEditing(true);
    }
  }, [autoFocusTitle]);

  useEffect(() => {
    if (editing) titleRef.current?.select();
  }, [editing]);

  function commitTitle() {
    const next = title.trim();
    if (next && next !== stack.title) onRename(next);
    else setTitle(stack.title);
    setEditing(false);
  }

  function submitTask(e: FormEvent) {
    e.preventDefault();
    onAddTask(draft);
    setDraft("");
    addRef.current?.focus();
  }

  return (
    <section className="sheet flex min-h-80 flex-col rounded-lg p-3 text-card-foreground md:min-h-96 md:p-4">
      <header className="flex items-center gap-2 px-1 pb-2">
        {editing ? (
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setTitle(stack.title);
                setEditing(false);
              }
            }}
            maxLength={32}
            aria-label="Tên ô"
            className="min-w-0 flex-1 bg-transparent font-display text-2xl leading-tight text-foreground outline-none md:text-3xl"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-w-0 flex-1 truncate text-left font-display text-2xl leading-tight text-foreground md:text-3xl"
            title="Đổi tên ô"
          >
            {stack.title}
          </button>
        )}
        <span className="shrink-0 px-1 text-lg tabular-nums text-muted-foreground">
          {open.length}
        </span>
        {canRemove ? (
          confirmRemove ? (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="destructive"
                size="sm"
                className="h-11 px-3 text-lg"
                onClick={onRemove}
              >
                Xóa
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 px-3 text-lg"
                onClick={() => setConfirmRemove(false)}
              >
                Hủy
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
              aria-label={`Xóa ô ${stack.title}`}
              onClick={() => {
                if (stack.tasks.length === 0) onRemove();
                else setConfirmRemove(true);
              }}
            >
              <X className="size-5" />
            </Button>
          )
        ) : null}
      </header>

      <form onSubmit={submitTask} className="mb-2 shrink-0 px-0.5">
        <label className="flex min-h-12 items-center gap-2 rounded-md bg-muted/80 px-2 py-1.5">
          <span className="flex size-7 shrink-0 items-center justify-center text-muted-foreground">
            <Plus className="size-5" strokeWidth={2.25} />
          </span>
          <input
            ref={addRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Thêm việc…"
            maxLength={200}
            className="min-w-0 flex-1 bg-transparent text-xl text-foreground outline-none placeholder:text-muted-foreground md:text-2xl"
          />
        </label>
      </form>

      <div className="stack-scroll min-h-0 flex-1 overflow-y-auto px-0.5">
        {open.length === 0 ? (
          <p className="px-1 py-3 text-lg leading-snug text-muted-foreground">
            {done.length > 0 ? "Xong hết việc đang mở." : "Chưa có việc. Gõ rồi Enter."}
          </p>
        ) : (
          <ul className="flex flex-col">
            {open.map((t) => (
              <li key={t.id}>
                <TaskRow
                  task={t}
                  onToggle={() => onToggleTask(t.id)}
                  onDelete={() => onDeleteTask(t.id)}
                />
              </li>
            ))}
          </ul>
        )}

        {done.length > 0 ? (
          <div className="mt-2 border-t border-border pt-2">
            <div className="flex items-center justify-between gap-2 px-1 py-1">
              <p className="text-lg text-muted-foreground">Đã xong · {done.length}</p>
              <button
                type="button"
                onClick={onClearDone}
                className="min-h-11 px-1 text-lg text-muted-foreground hover:text-foreground"
              >
                Xóa hết
              </button>
            </div>
            <ul className="flex flex-col">
              {done.map((t) => (
                <li key={t.id}>
                  <TaskRow
                    task={t}
                    compact
                    onToggle={() => onToggleTask(t.id)}
                    onDelete={() => onDeleteTask(t.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
