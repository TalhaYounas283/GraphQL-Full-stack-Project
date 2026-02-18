const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Event",
  tableName: "events",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "text",
    },
    price: {
      type: "float",
    },
    date: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    creator: {
      type: "many-to-one",
      target: "User",
      inverseSide: "events",
      joinColumn: true,
      nullable: true, 
    },
    bookings: {
      type: "one-to-many",
      target: "Booking",
      inverseSide: "event",
    },
  },
});
