# 🎂 Birthday Mini Game

Một website chúc mừng sinh nhật dạng **mini game**, tối ưu cho điện thoại.
Người chơi bắt quà rơi → thắng game → màn hình giả lập "bị đơ" → bất ngờ hiện ảnh + lời chúc sinh nhật 🎉

Built với **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**. Không cần backend, không cần database.

## 🚀 Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000 (nên mở bằng chế độ điện thoại trong DevTools, hoặc mở trực tiếp trên điện thoại cùng mạng LAN).

## 📱 Trải nghiệm

1. **Start Screen** — màn hình mở đầu với nút "Bắt đầu nhiệm vụ".
2. **Mini Game** — bắt quà 🎁 bánh 🎂 bóng 🎈 rơi xuống, đạt 10 điểm trong 20 giây.
3. **Freeze Screen** — giả lập "máy đơ" với hiệu ứng glitch + loading bar đứng ở 99%.
4. **Birthday Reveal** — hiện ảnh + confetti + lời chúc + chút troll nhẹ.

---

## ✏️ Tùy chỉnh nhanh

### 1. Thay ảnh sinh nhật
Bỏ ảnh vào thư mục `public/` với tên chính xác **`birthday-photo.jpg`**.
Nếu chưa có ảnh, web tự hiện placeholder dễ thương (không lỗi). Nên dùng ảnh vuông 1:1.

### 2. Đổi lời chúc
Mở `components/BirthdayReveal.tsx`, sửa các hằng số ở đầu file:

```ts
const TITLE = "Bất ngờ chưa 🎉";
const MAIN_LINE = "Chúc mừng sinh nhật nhaaa!";
const WISH = "Chúc bạn tuổi mới...";
const TROLL = "Lúc nãy không phải máy đơ đâu...";
```

### 3. Đổi số điểm cần đạt / thời gian
Mở `components/MiniGame.tsx`, sửa phần cấu hình ở đầu file:

```ts
const TARGET_SCORE = 10; // điểm cần để thắng
const GAME_TIME = 20;    // thời gian (giây)
const SPAWN_EVERY = 700; // tốc độ sinh item (ms)
```

### 4. Đổi lời nhắn màn hình "đơ"
Mở `components/FreezeScreen.tsx`, sửa mảng `MESSAGES`.

### 5. Âm thanh
Âm thanh được tạo bằng **Web Audio API** (`lib/sound.ts`) — không cần file nhạc.
Có tiếng khi bắt quà, thắng/thua, glitch và một đoạn nhạc chúc mừng ở màn reveal.
Người dùng có thể tắt/bật bằng nút 🔊 ở góc màn hình reveal.
Vì giới hạn của trình duyệt mobile, âm thanh chỉ bật sau khi người dùng bấm "Bắt đầu nhiệm vụ".

---

## ☁️ Deploy lên Vercel

1. Push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Birthday mini game"
   git branch -M main
   git remote add origin <link-repo-github-cua-ban>
   git push -u origin main
   ```
2. Vào [vercel.com](https://vercel.com) → **Add New → Project** → import repository vừa push.
3. Giữ nguyên cấu hình mặc định (Vercel tự nhận diện Next.js) → bấm **Deploy**.
4. Sau khi deploy xong, copy link `.vercel.app` và gửi cho bạn bè 🎈

> Đừng quên thêm ảnh `birthday-photo.jpg` vào `public/` rồi commit lại trước khi deploy nhé!
