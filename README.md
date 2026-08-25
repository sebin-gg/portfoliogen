# 🎯 Portfolio Gen

**Portfolio Gen** is a responsive, theme-based portfolio website generator built with **React** and **Node.js**. Enter your details once, pick a theme, and get a professional personal website as a downloadable HTML file.

---

## 🔧 Features

- 📄 One-page input form for user details
- 🎨 Four professionally designed themes
- 💡 Smooth UI animations and transitions
- 🖼 Profile picture integration with visual styling
- 🔗 Social media and GitHub link support
- 📁 Auto-generated downloadable HTML file
- 🧩 Modular and scalable codebase

---

## 🖌 Themes

Four themes ship as standalone HTML templates in `backend/templates/`, each styled with pure CSS:

| Theme   | Template        | Description                                        |
|---------|-----------------|----------------------------------------------------|
| Classic | `classic.html`  | Rich purple and lavender palette                   |
| Minimal | `minimal.html`  | Understated layout in muted green and brown hues   |
| Pastel  | `pastel.html`   | Calm, elegant look built on soft blue tones        |
| Vibrant | `vibrant.html`  | Playful mix of teal, pink, orange, and coral       |

Each theme keeps the same content structure and differs only in styling.

---

## 📝 User Inputs

The app collects the following user inputs:

- **Full Name** *(required)*
- **About Me** *(required)*
- **Email Address** *(required)*
- **Phone Number** *(optional)*
- **Profile Picture**
- **Skills** *(add/remove supported)*
- **Projects** (up to 3 with name, description, tech stack, GitHub link)
- **Social Links** (LinkedIn, GitHub, Instagram)
- **Theme Selection** (from the 4 available themes)

---

## 🛠 Tech Stack

| Area      | Technology           |
|-----------|----------------------|
| Frontend  | React 19 (Vite)      |
| Backend   | Node.js, Express     |
| Styling   | Modular CSS          |
| Deploy    | GitHub Pages (`gh-pages`) |

---

## 🗂 Project Structure

```
portfoliogen/
├── frontend/              # React client
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── InputPage.jsx
│   │   │   ├── ResultPage.jsx
│   │   │   └── WelcomePage.jsx
│   │   ├── styles/
│   │   │   ├── InputPage.css
│   │   │   ├── ResultPage.css
│   │   │   └── WelcomePage.css
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── backend/               # Express server
│   ├── templates/         # Theme templates (classic, minimal, pastel, vibrant)
│   ├── index.js
├── package.json           # Root scripts (dev/build/deploy via gh-pages)
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sebin-gg/portfoliogen.git
cd portfoliogen
```

### 2. Install Dependencies

**Frontend**

```bash
cd frontend
npm install
```

**Backend**

```bash
cd ../backend
npm install
```

### 3. Run the App

**Start Backend (Node/Express)**

```bash
cd ../backend
node index.js
```

The server runs on [http://localhost:5000](http://localhost:5000).

**Start Frontend (Vite)**

In another terminal window:

```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build and Deploy

Build the frontend for production and preview it locally:

```bash
cd frontend
npm run build     # outputs to frontend/dist
npm run preview   # serve the production build locally
```

Deploy to GitHub Pages using the root `package.json` scripts:

```bash
npm run deploy    # predeploy runs the build, then gh-pages publishes dist
```

> **Config note:** when deploying under a subpath such as `/portfoliogen/`, set `base` in `frontend/vite.config.js` accordingly. Use `'/'` for local development.

---

## 🧭 Customization Pointers

- **Themes:** edit the HTML/CSS templates in `backend/templates/`
- **Form fields and validation:** `frontend/src/pages/InputPage.jsx`
- **API calls to the backend:** `frontend/src/api.js`
- **Server routes and generation logic:** `backend/index.js`

---

## 🤝 Contributors

Created by:

* **Sebin**: backend logic, integration, deployment
* **Lisha**: frontend development, design, styling

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to fork, adapt, and contribute to the project.

## 🔒 Security

This repository uses [gitleaks](https://github.com/gitleaks/gitleaks) for automatic secret scanning on every commit.

### Pre-commit Hook

A pre-commit hook is configured to scan for secrets before each commit. This helps prevent accidentally committing sensitive information like:
- API keys
- Passwords
- Tokens
- Private keys

### Setup

To enable the pre-commit hook locally:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
```

### Bypass (Emergency Only)

In case of emergency, you can bypass the hook:

```bash
git commit --no-verify -m "emergency commit"
```

> ⚠️ Only use `--no-verify` in emergency situations. Regular commits should always be scanned.
