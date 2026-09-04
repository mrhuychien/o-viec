# Ô Việc

Bảng quản lý công việc: một trang, tám ô. Tick việc thì dòng rớt xuống **Đã xong**. Có thể thêm/bớt ô, đổi tên ô. Dữ liệu lưu trên trình duyệt (localStorage).

## Dùng

- Gõ vào **Thêm việc…** rồi Enter
- Tick checkbox để hoàn thành — việc rớt xuống **Đã xong**
- **Thêm ô** / nút X trên ô để thêm hoặc xóa stack
- Bấm tên ô để đổi tên

## Chạy local

```bash
git clone https://github.com/mrhuychien/o-viec.git
cd o-viec
npm install
npm run dev
```

Mở http://localhost:8080

```bash
npm run build
npm run typecheck
```

## Deploy lên Vercel

1. Vào [vercel.com/new](https://vercel.com/new)
2. Import repo **mrhuychien/o-viec** (repo đang ở chế độ private — đăng nhập GitHub của bạn)
3. Framework preset: Vite. Build command: `npm run build`.
4. Deploy.

`vite.config.ts` đã bật Nitro preset `vercel`.

Stack: React 19, TanStack Start, Tailwind v4, Zustand.
