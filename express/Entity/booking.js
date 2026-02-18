const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Booking",
  tableName: "bookings",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true, 
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,  
    },
  },
  relations: {
    event: {
      type: "many-to-one",
      target: "Event",
      inverseSide: "bookings",  
      joinColumn: true,
    },
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "bookings",  
      joinColumn: true,
    },
  },
});