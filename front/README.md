# React GraphQL Frontend

Modern React frontend for the GraphQL Event Management application.

## Features

- User authentication (Login/Register)
- Event browsing and booking
- User dashboard with booking history
- Admin panel for event management
- Responsive design
- Toast notifications

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **GraphQL Client** - API communication
- **CSS Modules** - Styling

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

## Project Structure

```
front/
├── public/           # Static assets
├── src/
│   ├── api/          # GraphQL operations
│   │   └── operations.js
│   ├── components/   # Reusable components
│   │   ├── Header.jsx
│   │   ├── ProtectedRoutes.jsx
│   │   └── ToastProvider.jsx
│   ├── pages/        # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Events.jsx
│   │   ├── CreateEvent.jsx
│   │   ├── Booking.jsx
│   │   └── User.jsx
│   ├── context/      # React contexts
│   ├── App.jsx       # Main app component
│   ├── index.css     # Global styles
│   └── main.jsx      # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Available Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home / Events list | Public |
| `/login` | User login | Public |
| `/register` | User registration | Public |
| `/dashboard` | User dashboard | Private |
| `/events/create` | Create event | Admin only |
| `/bookings` | My bookings | Private |
| `/users` | User management | Admin only |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Environment Variables

Create `.env` file:

```env
VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

## Docker

```bash
# Build image
docker build -t graphql-frontend .

# Run container
docker run -p 5173:5173 graphql-frontend
```

## API Integration

GraphQL operations are defined in `src/api/operations.js`:
- Authentication (login, register)
- Event queries and mutations
- Booking queries and mutations
- User management

## Authentication Flow

1. User logs in via `login` mutation
2. JWT token stored in localStorage
3. Token sent with each request via Authorization header
4. Protected routes check for valid token
5. Admin routes check for admin role
