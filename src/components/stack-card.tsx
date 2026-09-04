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
    <section className="flex min-h-0 flex-col rounded-xl bg-card p-1.5 text-card-foreground shadow-[var(--shadow-card)] md:p-2">
      <header className="flex items-center gap-1 px-1 pb-1">
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
            className="min-w-0 flex-1 bg-transparent font-display text-sm font-medium tracking-tight text-foreground outline-none md:text-base"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-w-0 flex-1 truncate text-left font-display text-sm font-medium tracking-tight italic text-foreground md:text-base"
            title="Đổi tên ô"
          >
            {stack.title}
          </button>
        )}
        <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {open.length}
        </span>
        {canRemove ? (
          confirmRemove ? (
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                variant="destructive"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={onRemove}
              >
                Xóa
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setConfirmRemove(false)}
              >
                Hủy
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Xóa ô ${stack.title}`}
              onClick={() => {
                if (stack.tasks.length === 0) onRemove();
                else setConfirmRemove(true);
              }}
            >
              <X className="size-3.5" />
            </Button>
          )
        ) : null}
      </header>

      <form onSubmit={submitTask} className="mb-1 shrink-0 px-0.5">
        <label className="flex items-center gap-2 rounded-md bg-muted/70 px-1.5 py-1 md:py-1.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground">
            <Plus className="size-3.5" strokeWidth={2} />
          </span>
          <input
            ref={addRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Thêm việc…"
            maxLength={200}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </form>

      <div className="stack-scroll min-h-0 flex-1 overflow-y-auto px-0.5">
        {open.length === 0 ? (
          <p className="px-1.5 py-2 text-xs leading-snug text-muted-foreground">
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
          <div className="mt-1 border-t border-border pt-1">
            <div className="flex items-center justify-between px-1 py-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Đã xong · {done.length}
              </p>
              <button
                type="button"
                onClick={onClearDone}
                className="text-xs text-muted-foreground hover:text-foreground"
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
