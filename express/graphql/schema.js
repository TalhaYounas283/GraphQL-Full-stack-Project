const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    enum UserRole {
        USER
        ADMIN
    }

    type Booking {
        id: ID!
        createdAt: String!
        updatedAt: String!
        event: Event!
        user: User!
    }

    type User {
        id: ID!
        role: UserRole!
        name: String!
        email: String!
        password: String!
        events: [Event!]
        bookings: [Booking!]
    }

    type Event {
        id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!  
        bookings: [Booking!]
    }
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        events: [Event!]!
        users: [User!]!
        bookings: [Booking!]!
        booking(id: ID!): Booking!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
        creatorId: ID!
    }

    input UserInput {
        name: String!
        email: String!
        password: String!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event!
        updateEvent(eventId: ID!, eventInput: EventInput): Event!
        deleteEvent(eventId: ID!): Boolean!
        createUser(userInput: UserInput): User!
        updateUser(userId: ID!, userInput: UserInput): User!
        deleteUser(userId: ID!): Boolean!
        getUserById(userId: ID!): User!
        createBooking(eventId: ID!, userId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
