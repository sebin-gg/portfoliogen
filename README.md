# 🎯 Portfolio Gen

**Portfolio Gen** is a responsive, theme-based portfolio website generator built with **React** and **Node.js**. It enables users to quickly generate a professional personal website by entering key information and selecting from beautifully designed themes.

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

| **Theme**                   | **Description**                                               |
|----------------------------|---------------------------------------------------------------|
| Professional Blue          | Corporate and modern look with blue and teal tones            |
| Earthy Calm                | Nature-inspired theme with muted green and brown hues         |
| Marvelous Macarons         | Soft and colorful pastels with a playful vibe                 |
| Lavender Fields Forever    | Elegant and calm palette using lavender tones                 |

**Each theme includes:**
-Consistent structure  
-Unique styling using pure CSS  

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
| Frontend  | React (Vite)         |
| Backend   | Node.js, Express     |
| Styling   | Modular CSS          |

---

## 🗂 Project Structure

```

portfolio-gen/
│
├── frontend/          # React client
│   ├── public/
│   └── src/
│       └── assets/
│       └── pages/
│       |   └── Inputpage.jsx
│       |   └── ResultPage.jsx 
│       |   └── Welcomepage.jsx
│       └── styles/
│       |   └── Inputpage.css
│       |   └── ResultPage.css 
│       |   └── Welcomepage.css
│       └── App.css
│       └── App.jsx
│       └── Indesx.css
│       └── Indesx.jsx
│   └── Index.html
│   └── Viteconfig.js
├── backend/           # Express server
│   └── templates/
│   |   ├── classic.html
│   |   ├── minimal.html
│   |   ├── Pastel.html
|   |   ├── Vibrant.html
|   |
│   └── index.js
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sebin-gg/portfoliogen.git
````

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

**Start Frontend (Vite)**

```bash
cd ../frontend
npm run dev
```
**open another terminal window**

**Start Backend (Node/Express)**

```bash
cd backend
node index.js
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🤝 Contributors

Created by:

* **Sebin** – Backend logic, integration, deployment
* **Lisha** – Frontend development, design, styling

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

