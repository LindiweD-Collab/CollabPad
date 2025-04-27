# 📄 CollabPad

**CollabPad** is a real-time collaborative editor and sticky notes app!  
It supports:
- Live text collaboration (via WebSocket)
- Code editing (via CodeMirror)
- Drag-and-drop sticky notes (via Interact.js)
- Light/Dark mode toggle
- Save documents as `.txt` or `.pdf`

---

## 🚀 Features

- **Collaborative Editing:** Multiple users can edit text together in real-time.
- **Sticky Notes:** Add, drag, and organize sticky notes freely.
- **Code Editor:** Write and highlight JavaScript code with CodeMirror.
- **Dark Mode:** Switch between light and dark themes.
- **Save & Export:** Save your document as plain text or as a PDF.
- **Persistent Storage:** Auto-save text locally using `localStorage`.

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS (Flexbox + Grid), JavaScript
- **Libraries Used:**
  - [CodeMirror](https://codemirror.net/) — Code Editor
  - [Interact.js](https://interactjs.io/) — Drag & Drop
  - [jsPDF](https://github.com/parallax/jsPDF) — Save as PDF
- **Backend:** Node.js, WebSocket (native `ws` package)

---

## ⚙️ Installation (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/collabpad.git
   cd collabpad
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app:**
   ```bash
   node server.js
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## 🧹 Deployment

You can deploy this project for free using:

- [Render](https://render.com/)
- [Vercel](https://vercel.com/) *(for frontend only)*
- [Railway](https://railway.app/)
- [Fly.io](https://fly.io/)

> ⚠️ If you're using Render or HTTPS hosting, make sure you use `wss://` instead of `ws://` for WebSocket connections!

---

## 📂 Folder Structure

```
collabpad/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── README.md
└── .gitignore
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you would like to change.

---

> Made with ❤️ for real-time collaboration.

---

---

### 🌟 Bonus: Quick `.gitignore`
Add this file called `.gitignore` to your root folder:

```gitignore
node_modules/

```

---

