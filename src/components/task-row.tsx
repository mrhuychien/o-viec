import { Check, X } from "lucide-react";
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
        "group flex items-start gap-2 rounded-sm px-1",
        compact ? "py-0.5" : "py-1",
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
          "relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm transition-colors duration-150",
          "after:absolute after:top-1/2 after:left-1/2 after:size-7 after:-translate-x-1/2 after:-translate-y-1/2",
          task.done
            ? "bg-primary text-primary-foreground"
            : "bg-card text-transparent shadow-[0_0_0_1.5px_color-mix(in_oklab,var(--color-foreground)_28%,transparent)] hover:shadow-[0_0_0_1.5px_var(--color-primary)]",
        )}
      >
        <Check className="size-3.5" strokeWidth={2.5} />
      </button>
      <p
        className={cn(
          "min-w-0 flex-1 truncate pt-px leading-snug",
          compact ? "text-xs" : "text-sm",
          task.done
            ? "text-done line-through decoration-done/80"
            : "text-foreground",
        )}
        title={task.text}
      >
        {task.text}
      </p>
      <button
        type="button"
        aria-label={`Xóa ${task.text}`}
        onClick={onDelete}
        className={cn(
          "relative mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-opacity duration-150 hover:bg-muted hover:text-foreground",
          "after:absolute after:top-1/2 after:left-1/2 after:size-7 after:-translate-x-1/2 after:-translate-y-1/2",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
        )}
      >
        <X className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
