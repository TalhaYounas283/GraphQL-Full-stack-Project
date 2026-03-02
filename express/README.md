# Express GraphQL Backend

GraphQL API server built with Express.js and Apollo Server.

## Features

- GraphQL API with type definitions and resolvers
- JWT authentication middleware
- User management (Admin/User roles)
- Event management system
- Booking system
- Database integration with TypeORM

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Apollo Server Express** - GraphQL server
- **TypeORM** - Database ORM
- **MySQL/PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm start
```

Server runs at `http://localhost:3000/graphql`

## Project Structure

```
express/
├── Entity/           # Database entities (User, Event, Booking)
├── graphql/          # Schema and resolvers
│   ├── resolver/     # Query and mutation resolvers
│   └── schema.js     # GraphQL type definitions
├── middleware/       # Auth middleware
├── db-config/        # Database configuration
├── utilites/         # Helper functions
├── app.js           # Express app setup
├── server.js        # Server entry point
├── seedAdmin.js     # Admin user seeder
└── Dockerfile       # Docker configuration
```

## API Endpoints

### Queries
- `users` - Get all users
- `user(id)` - Get single user
- `events` - Get all events
- `event(id)` - Get single event
- `bookings` - Get user's bookings
- `login(email, password)` - Authenticate user

### Mutations
- `createUser(userInput)` - Register user
- `createEvent(eventInput)` - Create event (Admin only)
- `cancelEvent(id)` - Cancel event
- `bookEvent(eventId)` - Book an event
- `cancelBooking(bookingId)` - Cancel booking

## Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=graphql_db
JWT_SECRET=your_secret_key
```

## Default Admin

Run seed script:
```bash
node seedAdmin.js
```

- Email: `admin@example.com`
- Password: `admin123`

## Docker

```bash
# Build image
docker build -t graphql-express .

# Run container
docker run -p 5000:5000 graphql-express
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start server |
| `npm run dev` | Start with nodemon (if configured) |
