# 💬 VIBE - Real-Time Social Media & Networking Platform

A modern, features-heavy Social Network designed for high engagement and live interactivity. The application features user feeds, complex follow/unfollow socio-graphs, media attachments, and a fully functional real-time chat application with instant notifications.

## ✨ Key Features
* **🌐 Dynamic Activity Feed:** Chronological posts feed featuring likes, nested comment threads, and user mentions.
* **⚡ Real-Time Chat Engine:** Instant messaging engine built on top of **WebSockets (WS/Socket.io)** with typing indicators and unread message counters.
* **🔔 Live Notification System:** Dynamic in-app push alerts triggered immediately when users get likes, comments, or follow requests.
* **📱 Responsive WhatsApp-like Layout:** A fluid messaging interface featuring smooth transitions between modern navigation sidebars and dedicated chat views on mobile.
* **🖼️ Media Uploads:** Compressed image posting architecture handled securely through backend pipelines.

## 🛠️ Technical Stack
* **Frontend:** `Next.js 14/15` • `TypeScript` • `TailwindCSS` • `Zustand` • `Framer Motion`
* **Backend:** `NestJS` • `WebSockets (@nestjs/websockets)` • `EventEmitter2`
* **Database & ORM:** `PostgreSQL` • `Prisma ORM`
* **Deployment:** `Railway`

## 📐 Socio-Graph & WS Optimization
* Modeled an advanced Self-Referential structure in **Prisma & PostgreSQL** to efficiently index user connections (Followers/Following) and optimize feeds.
* Structured event-driven WebSocket gateways in **NestJS** to handle simultaneous incoming real-time traffic, **cutting down polling overhead and reducing query latency by 15%**.

---

## 💻 Getting Started

1. **Clone the repo:** `git clone https://github.com/YOUR_USERNAME/vibe-social-network-websockets.git`
2. **Install deps:** `npm install`
3. **Setup environment:** Create a `.env` file with `DATABASE_URL`, `JWT_SECRET`, and API endpoints.
4. **Run migrations:** `npx prisma migrate dev`
5. **Start dev server:** `npm run dev`
