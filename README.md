# 🎓 CampusHub

![MIT License](https://img.shields.io/github/license/Sudarsanam-R/campushub)
![Vercel](https://vercelbadge.vercel.app/api/user/project) <!-- use your real URL -->
![Next.js](https://img.shields.io/badge/Next.js-15.3.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![Stars](https://img.shields.io/github/stars/Sudarsanam-R/campushub?style=social)

> A modern, elegant web app to discover and register for college events and hackathons.

---

## 🌟 Features

- 🔐 OAuth login with Google, GitHub, Facebook, Apple, Microsoft
- 🌈 Aurora background + splash cursor + shiny animations
- 📅 Event cards + registration form
- 🌓 Light/dark theme toggle
- ⚙️ Built with Next.js, Tailwind, TypeScript, NextAuth

---

## 🚀 Getting Started

### 🧰 Requirements

Make sure you have the following installed on your system:

- **[Node.js](https://nodejs.org/)** (v18 or later recommended)
- **[Git](https://git-scm.com/)**
- A code editor like **[Visual Studio Code](https://code.visualstudio.com/)** (optional, but recommended)

To check if you already have Node.js and Git:

```bash
node -v
git --version
```

### 1. Get the Project Code

#### 🧪 Option A: Clone via Git

```bash
git clone https://github.com/Sudarsanam-R/campushub.git
cd campushub
```

#### 📁 Option B: Download ZIP

1. Go to: [https://github.com/Sudarsanam-R/campushub](https://github.com/Sudarsanam-R/campushub)
2. Click **"Code" → "Download ZIP"**
3. Extract the ZIP and open the folder in your terminal:

```bash
cd path-to-extracted-folder
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Create `.env` and `.env.example`

Copy all secrets and configuration into a `.env` file in the project root:

```env
# .env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/campushub
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

- **Never commit your real `.env` file to Git!**
- Instead, commit a `.env.example` with placeholder values for onboarding new developers.

---

### 4. Run Locally

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

Deployed on **Vercel**:  
➡️ [https://campushub.vercel.app](https://campushub.vercel.app)

Every push to the `main` branch will automatically trigger a deployment.

---

## 📂 Project Structure

```
.
├── app/                 # Pages and API routes (Next.js App Router)
├── components/          # Custom UI components (Header, Footer, OAuthButton, etc.)
├── public/              # Static assets
├── styles/              # Tailwind, animations, effects (CSS)
├── .env                 # All environment variables (excluded from Git)
├── .env.example         # Example env file (safe to commit)
├── .gitignore
├── README.md
└── package.json
```

---

## 🤝 Contributing

Pull requests and feedback welcome!  
Just fork the repo and submit a PR. ✨

---

## 🔒 Security

- User passwords are **never stored in plain text**. All passwords are securely hashed using [bcrypt](https://github.com/kelektiv/node.bcrypt.js) before being saved to the database.
- All secrets and API keys should be managed via your `.env` file and are excluded from version control by default.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Author

Built with ❤️ by [@Sudarsanam-R](https://github.com/Sudarsanam-R)

