const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {

    role: {
      type: "enum",
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    events: {
      type: "one-to-many",
      target: "Event",
      inverseSide: "creator",
    },
    bookings: {
      type: "one-to-many",
      target: "Booking",
      inverseSide: "user",
    },
  },
});
