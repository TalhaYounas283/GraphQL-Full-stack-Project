# GraphQL Full-Stack Application

A modern event management system built with GraphQL, featuring dual backend options (Express.js & NestJS) and a React frontend.

![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

## Features

- **User Authentication** - JWT-based authentication with role-based access (Admin/User)
- **Event Management** - Create, view, update, and delete events
- **Booking System** - Book events with real-time availability
- **Dual Backend** - Choose between Express.js or NestJS
- **Docker Support** - One-command deployment with Docker Compose
- **Modern UI** - Responsive React frontend with CSS Modules

## Tech Stack

### Backend (Express.js)
- Apollo Server Express
- GraphQL with type definitions & resolvers
- TypeORM for database management
- JWT authentication with bcryptjs

### Backend (NestJS - Alternative)
- NestJS framework
- Code-first GraphQL schema
- Prisma ORM
- Modular architecture

### Frontend
- React 19 with Vite
- React Router DOM
- CSS Modules
- GraphQL Client

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and start all services
git clone https://github.com/TalhaYounas283/GraphQL-Full-stack-Project.git
cd GraphQL-Full-stack-Project
docker-compose up --build
```

Access the app:
- Frontend: http://localhost:5173
- Express API: http://localhost:5000/graphql
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

**1. Express Backend**
```bash
cd express
npm install
# Create .env file (see Environment Variables section)
npm start
# Server: http://localhost:3000/graphql
```

**2. NestJS Backend (Optional)**
```bash
cd nest-js
npm install
# Create .env file
npm run start:dev
# Server: http://localhost:3001/graphql
```

**3. Frontend**
```bash
cd front
npm install
npm run dev
# App: http://localhost:5173
```

## Environment Variables

### Express Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=graphql_db
JWT_SECRET=your_secret_key
```

### NestJS Backend (.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/graphql_db"
```

### Docker Environment
The docker-compose.yml includes all necessary environment variables for containerized deployment.

## Project Structure

```
GraphQL/
├── express/              # Express.js + Apollo Server
│   ├── Entity/           # Database entities
│   ├── graphql/          # Schema & resolvers
│   ├── middleware/       # Auth middleware
│   ├── Dockerfile
│   └── seedAdmin.js      # Admin user seeder
├── nest-js/              # NestJS backend (alternative)
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── front/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│   └── Dockerfile
└── docker-compose.yml
```

## API Overview

### Authentication
- `login(email, password)` - User login
- `createUser(userInput)` - Register new user

### Events
- `events` - List all events
- `event(id)` - Get single event
- `createEvent(eventInput)` - Create event (Admin only)
- `cancelEvent(id)` - Cancel event

### Bookings
- `bookings` - List user's bookings
- `bookEvent(eventId)` - Book an event
- `cancelBooking(bookingId)` - Cancel a booking

## Default Admin Account

When using Docker or running `seedAdmin.js`:
- Email: `admin@example.com`
- Password: `admin123`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run Express backend + frontend |
| `npm run client` | Run frontend only |
| `npm run server:express` | Run Express backend only |

## Screenshots

*Dashboard - Event Management Interface*

*Booking System - User-friendly event booking*

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file

## Author

**Talha Younas**
- GitHub: [@TalhaYounas283](https://github.com/TalhaYounas283)

---

⭐ Star this repo if you find it helpful!
