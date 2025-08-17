# 🚀 DevTinder (DevConnect)

> **Tinder for Developers** - Connect, Collaborate, and Code Together!

A modern web application designed specifically for developers to connect with like-minded professionals, collaborate on projects, and build meaningful professional relationships in the tech community.

## ✨ Features

### 🔐 Authentication & Profile Management
- **User Registration & Login** - Secure authentication system
- **Profile Management** - Create and edit your developer profile
- **Password Management** - Secure password updates

### 🤝 Connection System
- **Smart Matching** - Find developers with similar interests and skills
- **Connection Requests** - Send and manage connection requests
- **Request Management** - Accept, reject, or ignore incoming requests
- **Connection Status** - Track relationship status (interested, accepted, rejected, ignored)

### 💬 Real-time Communication
- **Live Chat** - Real-time messaging with connected developers
- **Online Status** - See who's currently online
- **Instant Notifications** - Get notified of new messages and requests

### 📱 Modern User Interface
- **Responsive Design** - Works seamlessly on all devices
- **Dark/Light Theme** - Customizable theme options
- **Modern UI/UX** - Built with Tailwind CSS and DaisyUI
- **Interactive Feed** - Swipe through developer profiles

### 🔄 Real-time Updates
- **Live Feed** - Real-time profile updates
- **Socket Integration** - Instant updates across all connected clients
- **Real-time Notifications** - Stay updated with live events

## 🛠️ Tech Stack

### Frontend (Client)
- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Socket.io Client** - Real-time communication
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - In-memory data structure store
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image management
- **AWS SES** - Email service integration

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Jenkins** - CI/CD pipeline
- **Nginx** - Web server and reverse proxy

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd DevTinder
   ```

2. **Set up environment variables**
   ```bash
   # Copy and configure server environment variables
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cd ../server
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

4. **Start the client**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
DevTinder/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utilities and Redux store
│   │   └── main.jsx       # Application entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend application
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # Database models
│   │   ├── middlewares/   # Express middlewares
│   │   ├── utils/         # Utility functions
│   │   └── app.js         # Server entry point
│   └── package.json       # Backend dependencies
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### Profile Management
- `GET /profile/view` - View user profile
- `PATCH /profile/edit` - Edit user profile
- `PATCH /profile/password` - Update password

### Connections
- `POST /request/send/:status/:userId` - Send connection request
- `POST /request/review/accepted/:requestId` - Accept request
- `POST /request/review/rejected/:requestId` - Reject request

### User Operations
- `GET /user/requests/received` - Get received requests
- `GET /user/connections` - Get user connections
- `GET /user/feed` - Get user feed

## 🎯 Key Features Explained

### Connection System
The app uses a sophisticated connection system where users can:
- **Ignore** - Dismiss profiles they're not interested in
- **Interested** - Express interest in connecting
- **Accept/Reject** - Respond to incoming connection requests

### Real-time Features
- **Live Chat**: Instant messaging between connected users
- **Online Status**: Real-time online/offline indicators
- **Live Feed**: Dynamic updates without page refresh
- **Notifications**: Instant alerts for new activities

### Profile Management
- **Rich Profiles**: Detailed developer information
- **Skill Tags**: Easy skill identification
- **Project Showcase**: Display your work
- **Professional Networking**: Build meaningful connections

## 🐳 Docker Configuration

The project includes comprehensive Docker support:

- **Multi-stage builds** for optimized production images
- **Docker Compose** for easy local development
- **Nginx** reverse proxy for the frontend
- **Environment-based configuration**

## 🔧 Development

### Available Scripts

#### Frontend (Client)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

#### Backend (Server)
```bash
npm run dev      # Start with nodemon (development)
npm start        # Start production server
```

### Code Quality
- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **React Hooks** linting rules
- **Modern JavaScript** features

## 🌐 Environment Variables

Create a `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/devtinder
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AWS SES
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region

# Server
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Docker Deployment
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gourav Chaudhary** - [@GouravSittam](https://github.com/GouravSittam)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better developer networking
- Community-driven development approach

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy Coding and Connecting! 🚀💻**
