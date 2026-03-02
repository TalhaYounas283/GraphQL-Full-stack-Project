export const LOGIN_QUERY = `
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
      tokenExpiration
    }
  }
`;

export const GET_USER_BY_ID_MUTATION = `
  mutation GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      id
      role
      name
      email
    }
  }
`;

export const CREATE_USER_MUTATION = `
  mutation CreateUser($userInput: UserInput!) {
    createUser(userInput: $userInput) {
      id
      name
      email
    }
  }
`;

export const DASHBOARD_QUERY = `
  query DashboardData {
    events {
      id
      title
      description
      price
      date
      creator {
        id
        name
      }
    }
    users {
      id
      name
    }
    bookings {
      id
      event {
        id
        title
        price
      }
      user {
        id
        name
      }
    }
  }
`;

export const EVENTS_QUERY = `
  query Events {
    events {
      id
      title
      description
      price
      date
      creator {
        id
        name
      }
      bookings {
        id
        user {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_EVENT_MUTATION = `
  mutation CreateEvent(
    $title: String!
    $description: String!
    $price: Float!
    $date: String!
    $creatorId: ID!
  ) {
    createEvent(
      eventInput: {
        title: $title
        description: $description
        price: $price
        date: $date
        creatorId: $creatorId
      }
    ) {
      id
      title
    }
  }
`;

export const CREATE_BOOKING_MUTATION = `
  mutation CreateBooking($eventId: ID!, $userId: ID!) {
    createBooking(eventId: $eventId, userId: $userId) {
      id
      event {
        id
        title
      }
    }
  }
`;

export const USERS_QUERY = `
  query Users {
    users {
      id
      name
      email
      events {
        id
      }
      bookings {
        id
      }
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

export const BOOKINGS_QUERY = `
  query Bookings {
    bookings {
      id
      createdAt
      event {
        id
        title
        price
        date
        creator {
          id
          name
        }
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export const CANCEL_BOOKING_MUTATION = `
  mutation CancelBooking($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      id
      title
    }
  }
`;

export const DELETE_EVENT_MUTATION = `
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId)
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($userId: ID!, $userInput: UserInput!) {
    updateUser(userId: $userId, userInput: $userInput) {
      id
      name
      email
    }
  }
`;

export const UPDATE_EVENT_MUTATION = `
  mutation UpdateEvent($eventId: ID!, $eventInput: EventInput!) {
    updateEvent(eventId: $eventId, eventInput: $eventInput) {
      id
      title
      description
      price
      date
    }
  }
`;
