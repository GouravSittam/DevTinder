# 🚀 DevTinder – Advanced Developer Matchmaking Platform

<p align="center">
	<img src="client/public/DevConnectLogo.png" alt="DevTinder Logo" width="120" />
</p>

<p align="center">
	<a href="https://github.com/GouravSittam/DevTinder"><img src="https://img.shields.io/github/stars/GouravSittam/DevTinder?style=flat-square" alt="GitHub stars"></a>
	<a href="https://github.com/GouravSittam/DevTinder"><img src="https://img.shields.io/github/forks/GouravSittam/DevTinder?style=flat-square" alt="GitHub forks"></a>
	<a href="https://github.com/GouravSittam/DevTinder/blob/main/LICENSE"><img src="https://img.shields.io/github/license/GouravSittam/DevTinder?style=flat-square" alt="License"></a>
	<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
</p>

---

## About DevTinder

**DevTinder** is a next-generation matchmaking and networking platform for developers, inspired by Tinder but tailored for tech professionals. Connect, collaborate, and build your network based on skills, interests, and real-time interactions.

---

## ✨ Features

- 🔐 **Secure JWT Authentication**
- 🎯 **AI-Powered Matchmaking** based on skills, interests, and preferences
- 💬 **Real-time Chat & Notifications** (Socket.io)
- 📄 **Rich Developer Profiles** with skills, experience, and social links
- 🔄 **Swipe to Connect** – Like, Pass, and Match
- 📨 **Connection Requests & Management**
- 🗂️ **Organized Connections Dashboard**
- 🌗 **Dark/Light Theme Toggle**
- ⚡ **Performance Optimized** (MERN stack, Dockerized)
- 🚀 **Production Ready** (Nginx, Redis, CI/CD, Docker Compose)

---

## 🛠️ Tech Stack

**Frontend:**

- React.js (Hooks, Context, Redux Toolkit)
- Tailwind CSS
- Vite
- React Router DOM
- Axios

**Backend:**

- Node.js, Express.js
- MongoDB (Mongoose)
- JWT Auth
- Redis (Session/Token)
- Socket.io
- Nginx (Reverse Proxy)
- Docker & Docker Compose

**DevOps:**

- Jenkins (CI/CD)
- Docker Compose
- Nginx

---

## � Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/GouravSittam/DevTinder.git
cd DevTinder
```

### 2. Environment Variables

Create a `.env` file in the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SERVER_PORT=5000
REDIS_URL=redis://localhost:6379
SERVER_ENV=development
```

### 3. Start with Docker Compose (Recommended)

```bash
docker-compose up --build
```

Frontend: [http://localhost:5173](http://localhost:5173)  
Backend: [http://localhost:5000](http://localhost:5000)

### 4. Manual Setup (Dev Mode)

#### Client

```bash
cd client
pnpm install # or npm install
pnpm run dev # or npm run dev
```

#### Server

```bash
cd server
pnpm install # or npm install
pnpm run dev # or npm run dev
```

---

## 🌐 Deployment

- **Frontend:** Vercel, Netlify, Azure Static Web Apps
- **Backend:** Azure VM, Render, VPS, or Docker
- **Reverse Proxy:** Nginx (SSL, HTTPS)
- **CI/CD:** Jenkins pipeline (see `Jenkinsfile`)
- **Production Config:** Update CORS and API URLs in `client/src/utils/constants.js` and `server/src/app.js`

---

## � Project Structure

```text
DevTinder/
│
├── client/      # React frontend
│   ├── src/
│   └── ...
│
├── server/      # Node.js backend
│   ├── src/
│   └── ...
│
├── docker-compose.yml
├── Jenkinsfile
├── README.md
└── ...
```

---

## 🧑‍💻 Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) style and ensure your code passes linting and tests.

---

## 🛡️ Security & Best Practices

- Use HTTPS in production for both frontend and backend
- Set secure cookie options (`httpOnly`, `secure`, `sameSite`)
- Restrict CORS origins in production
- Store secrets and credentials in environment variables
- Regularly update dependencies

---

## 📞 Contact

For questions, suggestions, or support, open an issue or contact [Gourav Chaudhary](https://github.com/GouravSittam).

---

## 📃 License

This project is licensed under the MIT License by Gourav Chaudhary.
