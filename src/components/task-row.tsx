import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/board-store";

type TaskRowProps = {
  task: Task;
  compact?: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskRow({ task, compact, onToggle, onDelete }: TaskRowProps) {
  return (
    <div
      className={cn(
        "group flex min-h-8 items-start gap-3 px-1",
        compact ? "py-1" : "py-1.5",
        task.done ? "task-row-done" : "task-row",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? `Bỏ đánh dấu ${task.text}` : `Hoàn thành ${task.text}`}
        onClick={onToggle}
        className={cn(
          "relative mt-1 flex size-7 shrink-0 items-center justify-center rounded-[3px] transition-colors duration-150",
          "after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2",
          task.done
            ? "bg-primary text-primary-foreground"
            : "bg-card text-transparent shadow-[inset_0_0_0_2px_var(--color-foreground)] hover:bg-muted",
        )}
      >
        <span className="ink-check" aria-hidden="true" />
      </button>
      <p
        className={cn(
          "min-w-0 flex-1 pt-0.5 leading-snug text-pretty",
          compact ? "text-lg" : "text-xl md:text-2xl",
          task.done ? "text-done line-through decoration-done/80" : "text-foreground",
        )}
      >
        {task.text}
      </p>
      <button
        type="button"
        aria-label={`Xóa ${task.text}`}
        onClick={onDelete}
        className={cn(
          "relative mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-opacity duration-150 hover:bg-muted hover:text-foreground",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
        )}
      >
        <X className="size-5" strokeWidth={2.25} />
      </button>
    </div>
  );
}
