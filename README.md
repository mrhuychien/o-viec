# Ô Việc

Sổ việc viết tay: một trang, nhiều ô giấy. Tick thì dòng rớt xuống **Đã xong**. Đăng nhập Google hoặc X để mở cùng sổ trên máy tính và điện thoại.

## Dùng

- Đăng nhập một lần
- Gõ **Thêm việc…** rồi Enter
- Tick ô vuông để hoàn thành
- **Thêm ô** / nút X để thêm hoặc xóa stack
- Bấm tên ô để đổi tên

## Chạy local

```bash
git clone https://github.com/mrhuychien/o-viec.git
cd o-viec
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

## Deploy Vercel

Import repo `mrhuychien/o-viec` trên Vercel. Build: `npm run build`.

Stack: React 19, TanStack Start, Tailwind v4, Zustand, Better Auth.
