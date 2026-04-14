<div align="center">

<img src="public/mascot.png" alt="MewLearning Mascot" width="120" />

# 🦉 MewLearning

**Ứng dụng luyện hội thoại tiếng Anh thông minh**

Học tiếng Anh qua hội thoại thực tế, phát âm chuẩn, và kho từ vựng cá nhân — hoàn toàn miễn phí.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Giới thiệu

**MewLearning** là ứng dụng web học tiếng Anh qua hội thoại theo phong cách Duolingo — được xây dựng bằng Next.js 14 App Router. Mỗi topic là một đoạn hội thoại thực tế giữa các nhân vật, kèm giọng đọc AI chất lượng cao, luyện phát âm, dịch tiếng Việt tức thì, và kho từ vựng cá nhân tự động tra nghĩa.

> 🎯 **Mục tiêu**: Giúp người học tiếng Anh nghe — đọc — luyện phát âm — tích lũy từ vựng trong một trải nghiệm liền mạch, không cần trả phí cho dịch vụ bên ngoài.

---

## 🚀 Tính năng nổi bật

### 🎙️ Dialogue Practice
- **Nghe hội thoại** với giọng đọc AI tự nhiên (Microsoft Edge TTS — miễn phí, không cần API key)
- **6 giọng đọc** để chọn: Aria, Jenny, Ava (nữ) · Guy, Andrew, Brian (nam)
- **Điều chỉnh tốc độ**: 0.5× → 0.75× → 0.8× → 0.9× → 1× → 1.25×
- **Auto-play**: Tự động chuyển sang câu tiếp theo
- **Highlight dòng đang phát** — làm mờ các dòng đã qua
- **Dịch tiếng Việt** bật/tắt ngay trên thanh progress

### 🗣️ Luyện phát âm
- **Ghi âm giọng nói** trực tiếp trên trình duyệt
- **Chấm điểm phát âm** với phân tích chi tiết từng từ
- So sánh với giọng chuẩn AI ngay trong giao diện

### 📚 Kho từ vựng thông minh
- **Bôi đen bất kỳ cụm từ** trong hội thoại để lưu ngay
- **Tự động dịch sang tiếng Việt** (Google Translate + MyMemory — miễn phí)
- **Tra từ điển Anh**: Phiên âm IPA, từ loại, định nghĩa tiếng Anh
- Tìm kiếm, nghe lại, chỉnh sửa nghĩa inline

### ❤️ Yêu thích & Quản lý Topic
- **Import dialogue** từ file JSON / Excel / văn bản thuần
- **Tạo dialogue bằng AI** (tích hợp OpenAI GPT)
- **Đánh dấu yêu thích** từng topic bằng icon ❤️
- Tab **"Yêu Thích"** để xem nhanh danh sách topics đã lưu

### 📱 Responsive & UX
- **Giao diện mobile** với bottom navigation (Dialogue · Saved Words · Yêu Thích · Setting)
- **Dark mode / Light mode** tự động theo hệ thống
- **Avatar nhân vật** sinh động từ react-nice-avatar (deterministic theo tên)
- **Floating Controls (FAB)** tốc độ & giọng đọc ở góc màn hình
- **Mascot 🦉** xuất hiện ở đầu mỗi hội thoại

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + CSS Variables |
| **State** | Zustand + persist middleware |
| **Animation** | Framer Motion |
| **TTS** | Microsoft Edge TTS (`msedge-tts`) — free |
| **Translation** | `@vitalets/google-translate-api` + MyMemory API — free |
| **Dictionary** | Free Dictionary API (`dictionaryapi.dev`) |
| **AI (optional)** | OpenAI GPT-4o-mini (dialogue generation + pronunciation scoring) |
| **Avatar** | react-nice-avatar (deterministic SVG) |
| **UI Components** | Radix UI primitives |
| **Icons** | Lucide React |

---

## 📊 Thống kê dự án

```
📁 Components      38 files
📁 API Routes       9 endpoints
📦 Dependencies    ~25 packages
🎨 Zero external CSS frameworks beyond Tailwind
💰 Core features   100% FREE (no paid API needed)
```

---

## ⚡ Cài đặt & Chạy

### Yêu cầu
- Node.js ≥ 18
- npm hoặc yarn

### 1. Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/mew-learning.git
cd mew-learning
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:

```env
# Tùy chọn — cần nếu muốn dùng AI tạo dialogue và chấm phát âm
OPENAI_API_KEY=sk-...
```

> 💡 **Không có API key?** Vẫn dùng được đầy đủ: nghe hội thoại, dịch từ vựng, phát âm — tất cả đều miễn phí. Chỉ mất tính năng *tạo dialogue bằng AI*.

### 4. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại **http://localhost:3000**

---

## 🗂️ Cấu trúc thư mục

```
mew-learning/
├── app/
│   ├── api/
│   │   ├── tts/              # Microsoft Edge TTS endpoint
│   │   ├── translate/        # EN→VI translation (Google + MyMemory)
│   │   ├── pronunciation/    # Chấm điểm phát âm (OpenAI)
│   │   ├── audio-library/    # Download & upload audio tĩnh
│   │   └── training/         # AI conversation session
│   ├── page.tsx              # Root layout — tab navigation
│   └── layout.tsx
│
├── components/
│   ├── DialoguePlayer/       # Core: bubbles, playback, vocabulary tooltip
│   ├── FloatingControls/     # FAB speed + voice picker
│   ├── Layout/               # Header, Sidebar, MobileNav
│   ├── PronunciationPractice/# Record & score pronunciation
│   ├── SavedWords/           # Vocabulary table
│   ├── FavoriteTopics/       # Favorites grid view
│   ├── DataManagement/       # Import / AI generate
│   └── Settings/             # Settings panel
│
├── store/
│   ├── appStore.ts           # Topics, settings, favorites (Zustand persist)
│   └── vocabularyStore.ts    # Saved words (Zustand persist)
│
├── lib/
│   ├── tts.ts                # TTS service + 2-tier audio cache
│   ├── audioCache.ts         # IndexedDB + memory cache
│   └── audioLibrary.ts       # Local static audio file helpers
│
├── types/                    # TypeScript interfaces
└── public/
    ├── mascot.png
    └── audio-topic-library/  # (git-ignored) Downloaded audio files
```

---

## 🎮 Hướng dẫn sử dụng

1. **Import dialogue** — Click "Import / Generate" → tải file JSON hoặc để AI tạo hội thoại mới
2. **Chọn topic** — Click vào topic trong sidebar bên trái
3. **Nghe hội thoại** — Nhấn ▶ để auto-play hoặc click từng nút "Listen" trong bubble
4. **Luyện phát âm** — Click "Practice" trong bubble → ghi âm → nhận kết quả
5. **Lưu từ vựng** — Bôi đen bất kỳ cụm từ → tooltip hiện ra → nghĩa tự động điền → "Lưu từ vựng"
6. **Xem kho từ** — Tab "Saved Words" để ôn lại

---

## 🔧 Tùy chỉnh giọng đọc

Mở **FAB** ở góc dưới bên phải → icon 🔊 để chọn giọng riêng cho từng nhân vật:

| Giọng | Tên | Đặc điểm |
|---|---|---|
| Aria (nova) | Nữ | Clear & bright — mặc định |
| Jenny (shimmer) | Nữ | Warm & friendly |
| Ava (alloy) | Nữ | Expressive |
| Guy (onyx) | Nam | Professional — mặc định |
| Andrew (echo) | Nam | Natural & calm |
| Brian (fable) | Nam | Deep & clear |

---

## 📝 Định dạng Dialogue JSON

```json
{
  "id": "coffee-shop-001",
  "title": "Ordering Coffee",
  "difficulty": "beginner",
  "category": "Daily Life",
  "participants": ["Alice", "Barista"],
  "lines": [
    {
      "id": "line-1",
      "characterId": "Alice",
      "englishText": "Hi! Can I get a large latte, please?",
      "vietnameseText": "Xin chào! Cho tôi một ly latte cỡ lớn nhé?",
      "emotionTone": "cheerful"
    },
    {
      "id": "line-2",
      "characterId": "Barista",
      "englishText": "Of course! Would you like any syrup?",
      "vietnameseText": "Tất nhiên rồi! Bạn có muốn thêm syrup không?",
      "emotionTone": "friendly"
    }
  ]
}
```

---

## 🤝 Đóng góp

Pull requests và issues đều được chào đón! Nếu bạn muốn thêm tính năng hoặc báo lỗi, hãy mở issue trước.

---

## 📄 License

MIT © 2026

---

<div align="center">

Made by 🖐️ &amp; [Claude Code](https://claude.ai/claude-code) · 2026

<img src="public/mascot.png" alt="MewLearning" width="60" />

</div>
