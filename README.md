# GraphQL Full-Stack Project

A complete full-stack application with GraphQL APIs, featuring Express.js and NestJS backends with a Vite React frontend.

## Project Structure

```
GraphQL/
├── express/          # Express.js GraphQL Backend
├── nest-js/          # NestJS GraphQL Backend  
└── front/            # Vite React Frontend
```

## 📁 Projects

### 1. Express Backend (`express/`)
- **Framework:** Express.js with Apollo Server
- **Features:**
  - GraphQL API with type definitions and resolvers
  - Authentication middleware (JWT)
  - Event management system
  - User management
  - Booking system
  - Database integration with TypeORM
- **Key Technologies:**
  - Apollo Server Express
  - GraphQL
  - TypeORM
  - JWT Authentication
  - bcryptjs

**Setup:**
```bash
cd express
npm install
npm start
```

### 2. NestJS Backend (`nest-js/`)
- **Framework:** NestJS with GraphQL
- **Features:**
  - Code-first GraphQL schema generation
  - User management module
  - Prisma ORM integration
  - Modular architecture
- **Key Technologies:**
  - NestJS
  - GraphQL (Code First)
  - Prisma
  - TypeScript

**Setup:**
```bash
cd nest-js
npm install
npm run start:dev
```

### 3. Frontend (`front/`)
- **Framework:** React with Vite
- **Features:**
  - Modern React with JSX
  - Component-based UI architecture
  - Authentication context
  - Event management interface
  - Booking system UI
  - Toast notifications
  - Responsive design with CSS modules
- **Key Technologies:**
  - React 19
  - Vite
  - GraphQL Client
  - React Router DOM
  - CSS Modules

**Setup:**
```bash
cd front
npm install
npm run dev
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Database (configured in each backend)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/TalhaYounas283/GraphQl-Full-stack-Project-.git
cd GraphQl-Full-stack-Project-
```

2. **Start the Express Backend:**
```bash
cd express
npm install
# Configure your database in .env
npm start
```
Server runs on `http://localhost:3000`

3. **Start the NestJS Backend (Optional - alternative backend):**
```bash
cd nest-js
npm install
# Configure your database in .env
npm run start:dev
```
Server runs on `http://localhost:3001`

4. **Start the Frontend:**
```bash
cd front
npm install
npm run dev
```
App runs on `http://localhost:5173`

## 🔧 Environment Variables

### Express Backend
Create `.env` in `express/`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=graphql_db
JWT_SECRET=your_jwt_secret
```

### NestJS Backend
Create `.env` in `nest-js/`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/graphql_db"
```

## 📦 Features

- **User Authentication:** JWT-based auth system
- **Event Management:** Create, read, update, delete events
- **Booking System:** Book events with user authentication
- **GraphQL API:** Flexible queries and mutations
- **Responsive UI:** Mobile-friendly design
- **Modern Stack:** Latest React, NestJS, and Express

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js / NestJS
- GraphQL (Apollo Server)
- TypeORM / Prisma
- MySQL
- JWT Authentication

### Frontend
- React 19
- Vite
- React Router DOM
- CSS Modules
- GraphQL Client

## 📝 API Documentation

GraphQL Playground is available at:
- Express: `http://localhost:3000/graphql`
- NestJS: `http://localhost:3001/graphql`

## 👤 Author

**Talha Younas**
- GitHub: [@TalhaYounas283](https://github.com/TalhaYounas283)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/TalhaYounas283/GraphQl-Full-stack-Project-/issues).

---

⭐ Star this repo if you find it helpful!
