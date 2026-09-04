import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Task = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
  completedAt: number | null;
};

export type Stack = {
  id: string;
  title: string;
  tasks: Task[];
};

type BoardStore = {
  stacks: Stack[];
  addStack: () => string;
  removeStack: (id: string) => void;
  renameStack: (id: string, title: string) => void;
  addTask: (stackId: string, text: string) => void;
  toggleTask: (stackId: string, taskId: string) => void;
  deleteTask: (stackId: string, taskId: string) => void;
  clearDone: (stackId: string) => void;
};

export const MAX_STACKS = 16;
export const MIN_STACKS = 1;

function task(id: string, text: string, done = false): Task {
  return {
    id,
    text,
    done,
    createdAt: 1,
    completedAt: done ? 2 : null,
  };
}

export const DEFAULT_STACKS: Stack[] = [
  {
    id: "s1",
    title: "Hôm nay",
    tasks: [
      task("s1-t1", "Soạn email báo cáo tuần"),
      task("s1-t2", "Gọi anh Minh xác nhận lịch"),
      task("s1-t3", "Đưa quần áo đi giặt", true),
    ],
  },
  {
    id: "s2",
    title: "Tuần này",
    tasks: [
      task("s2-t1", "Lên kế hoạch sprint"),
      task("s2-t2", "Mua quà sinh nhật mẹ"),
      task("s2-t3", "Đặt lịch khám răng"),
    ],
  },
  {
    id: "s3",
    title: "Công việc",
    tasks: [
      task("s3-t1", "Viết đề xuất dự án mới"),
      task("s3-t2", "Review tài liệu API"),
      task("s3-t3", "Chuẩn bị slide họp", true),
    ],
  },
  {
    id: "s4",
    title: "Việc nhà",
    tasks: [
      task("s4-t1", "Sửa vòi nước bếp"),
      task("s4-t2", "Tính tiền điện tháng này", true),
      task("s4-t3", "Dọn tủ quần áo"),
    ],
  },
  {
    id: "s5",
    title: "Học tập",
    tasks: [
      task("s5-t1", "Xem bài React Query"),
      task("s5-t2", "Ôn 20 từ vựng tiếng Anh"),
      task("s5-t3", "Đọc chương 3"),
    ],
  },
  {
    id: "s6",
    title: "Cá nhân",
    tasks: [
      task("s6-t1", "Chạy bộ 30 phút"),
      task("s6-t2", "Gọi về nhà", true),
      task("s6-t3", "Đặt lịch cắt tóc"),
    ],
  },
  {
    id: "s7",
    title: "Ý tưởng",
    tasks: [
      task("s7-t1", "App ghi chú bằng giọng nói"),
      task("s7-t2", "Tủ đồ thông minh"),
    ],
  },
  {
    id: "s8",
    title: "Chờ",
    tasks: [
      task("s8-t1", "Phản hồi từ khách"),
      task("s8-t2", "Báo giá in ấn"),
      task("s8-t3", "Xác nhận phòng họp"),
    ],
  },
];

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      stacks: DEFAULT_STACKS,

      addStack: () => {
        const { stacks } = get();
        if (stacks.length >= MAX_STACKS) return "";
        const id = crypto.randomUUID();
        const n = stacks.length + 1;
        set({
          stacks: [...stacks, { id, title: `Ô ${n}`, tasks: [] }],
        });
        return id;
      },

      removeStack: (id) => {
        const { stacks } = get();
        if (stacks.length <= MIN_STACKS) return;
        set({ stacks: stacks.filter((s) => s.id !== id) });
      },

      renameStack: (id, title) => {
        const next = title.trim().slice(0, 32);
        if (!next) return;
        set({
          stacks: get().stacks.map((s) => (s.id === id ? { ...s, title: next } : s)),
        });
      },

      addTask: (stackId, text) => {
        const trimmed = text.trim().slice(0, 200);
        if (!trimmed) return;
        set({
          stacks: get().stacks.map((s) =>
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
          ),
        });
      },

      toggleTask: (stackId, taskId) => {
        set({
          stacks: get().stacks.map((s) =>
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
          ),
        });
      },

      deleteTask: (stackId, taskId) => {
        set({
          stacks: get().stacks.map((s) =>
            s.id !== stackId ? s : { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) },
          ),
        });
      },

      clearDone: (stackId) => {
        set({
          stacks: get().stacks.map((s) =>
            s.id !== stackId ? s : { ...s, tasks: s.tasks.filter((t) => !t.done) },
          ),
        });
      },
    }),
    {
      name: "o-viec-board",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ stacks: state.stacks }),
    },
  ),
);
