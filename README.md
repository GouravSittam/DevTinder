# 🚀 DevConnect - Developer Matchmaking Platform

DevConnect is a Tinder-inspired matchmaking platform exclusively for developers to connect, collaborate, and network based on their skills and interests.

🔗 **Live Demo:** www.devconnects.tech 
📂 **GitHub Repository:** [https://github.com/Abhinandan-Sah/DevConnect](https://github.com/Abhinandan-Sah/DevConnect)

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based authentication for safe and persistent sessions.
- 🎯 **Personalized Matchmaking:** Connect with developers based on skills, interests, and preferences.
- 💬 **Real-time Messaging:** Chat instantly with your matches.
- 📄 **Detailed Profiles:** Showcase your skills, interests, and experience.
- 🔄 **Swipe & Match:** Swipe to like or pass on other developers.
- 📨 **Connection Requests:** Send and manage connection requests.
- 🗂️ **Connections Management:** View and manage your developer connections.
- ⚙️ **Full Stack MERN Application:** Built with modern technologies for scalability and performance.
- 🌗 **Dark Mode:** Seamless light/dark theme support.

---

## 🛠️ Tech Stack

**Frontend:**
- ReactJS (with Hooks)
- Redux Toolkit (state management)
- Tailwind CSS (utility-first styling)
- React Router DOM (routing)
- Axios (API requests)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- Redis (for session/token management)
- Socket.io (real-time chat)
- Nginx (reverse proxy, production)
- CORS & Security Middlewares

---

## 🚧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abhinandan-Sah/DevConnect.git
cd DevConnect
```

### 2. Setup the Client

```bash
cd client
npm install
npm run dev
```
The client will run on [http://localhost:5173](http://localhost:5173) by default.

### 3. Setup the Server

```bash
cd ..
cd server
npm install
npm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000) by default.

### 4. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SERVER_PORT=5000
REDIS_URL=redis://localhost:6379
SERVER_ENV=development
```

---

## 🌐 Deployment

- **Frontend:** Can be deployed on Vercel, Netlify, or Azure Static Web Apps.
- **Backend:** Can be deployed on Azure VM, Render, or any VPS with Node.js support.
- **Reverse Proxy:** Use Nginx to serve the backend over HTTPS and handle SSL termination.
- **Environment:** Update CORS and API URLs for production in `client/src/utils/constants.js` and `server/src/app.js`.

---

## 📦 Folder Structure

```
DevConnect/
│
├── client/         # React frontend
│   ├── src/
│   └── ...
│
├── server/         # Node.js backend
│   ├── src/
│   └── ...
│
├── README.md
└── ...
```

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 🛡️ Security & Best Practices

- Use HTTPS in production for both frontend and backend.
- Set secure cookie options (`httpOnly`, `secure`, `sameSite`).
- Restrict CORS origins in productions.
- Store secrets and credentials in environment variables.

---

## 📞 Contact

For questions, suggestions, or support, open an issue or contact [Abhinandan Sah](https://github.com/Abhinandan-Sah).

---

## 📃 License By 

This project is licensed by Abhinandan Sah