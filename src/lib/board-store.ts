import { create } from "zustand";
import { saveBoard } from "@/lib/board-api";
import {
  DEFAULT_STACKS,
  MAX_STACKS,
  MIN_STACKS,
  type Stack,
} from "@/lib/board-types";

export type { Stack, Task } from "@/lib/board-types";
export { MAX_STACKS, MIN_STACKS, DEFAULT_STACKS };

type BoardStore = {
  stacks: Stack[];
  ready: boolean;
  hydrate: (stacks: Stack[]) => void;
  addStack: () => string;
  removeStack: (id: string) => void;
  renameStack: (id: string, title: string) => void;
  addTask: (stackId: string, text: string) => void;
  toggleTask: (stackId: string, taskId: string) => void;
  deleteTask: (stackId: string, taskId: string) => void;
  clearDone: (stackId: string) => void;
};

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pending: Stack[] | null = null;

function queueSave(stacks: Stack[]) {
  pending = stacks;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    const next = pending;
    pending = null;
    if (next) void saveBoard({ data: next }).catch(() => {});
  }, 400);
}

export function flushBoard() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  const next = pending ?? useBoardStore.getState().stacks;
  pending = null;
  if (useBoardStore.getState().ready) {
    void saveBoard({ data: next }).catch(() => {});
  }
}

export const useBoardStore = create<BoardStore>()((set, get) => ({
  stacks: DEFAULT_STACKS,
  ready: false,

  hydrate: (stacks) => {
    set({ stacks, ready: true });
  },

  addStack: () => {
    const { stacks } = get();
    if (stacks.length >= MAX_STACKS) return "";
    const id = crypto.randomUUID();
    const n = stacks.length + 1;
    const next = [...stacks, { id, title: `Ô ${n}`, tasks: [] }];
    set({ stacks: next });
    queueSave(next);
    return id;
  },

  removeStack: (id) => {
    const { stacks } = get();
    if (stacks.length <= MIN_STACKS) return;
    const next = stacks.filter((s) => s.id !== id);
    set({ stacks: next });
    queueSave(next);
  },

  renameStack: (id, title) => {
    const nextTitle = title.trim().slice(0, 32);
    if (!nextTitle) return;
    const next = get().stacks.map((s) => (s.id === id ? { ...s, title: nextTitle } : s));
    set({ stacks: next });
    queueSave(next);
  },

  addTask: (stackId, text) => {
    const trimmed = text.trim().slice(0, 200);
    if (!trimmed) return;
    const next = get().stacks.map((s) =>
      s.id !== stackId
        ? s
        : {
            ...s,
            tasks: [
              {
                id: crypto.randomUUID(),
                text: trimmed,
                done: false,
                createdAt: Date.now(),
                completedAt: null,
              },
              ...s.tasks,
            ],
          },
    );
    set({ stacks: next });
    queueSave(next);
  },

  toggleTask: (stackId, taskId) => {
    const next = get().stacks.map((s) =>
      s.id !== stackId
        ? s
        : {
            ...s,
            tasks: s.tasks.map((t) =>
              t.id !== taskId
                ? t
                : t.done
                  ? { ...t, done: false, completedAt: null }
                  : { ...t, done: true, completedAt: Date.now() },
            ),
          },
    );
    set({ stacks: next });
    queueSave(next);
  },

  deleteTask: (stackId, taskId) => {
    const next = get().stacks.map((s) =>
      s.id !== stackId ? s : { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) },
    );
    set({ stacks: next });
    queueSave(next);
  },

  clearDone: (stackId) => {
    const next = get().stacks.map((s) =>
      s.id !== stackId ? s : { ...s, tasks: s.tasks.filter((t) => !t.done) },
    );
    set({ stacks: next });
    queueSave(next);
  },
}));
