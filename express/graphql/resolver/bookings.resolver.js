const datasource = require("../../db-config/data-source");
const Booking = require("../../Entity/booking");
const Event = require("../../Entity/Event");
const User = require("../../Entity/User");
const { formatEventDate } = require("../../utilites/date.helper");
const { transformBooking } = require("./merge");

module.exports = {
  bookings: async (args , req) => {
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const bookings = await datasource.getRepository(Booking).find({
        relations: {
          user: true,
          event: {
            creator: true,
          },
        },
      });

      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      throw err;
    }
  },

  booking: async (args , req) => {
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const booking = await datasource.getRepository(Booking).findOne({
        where: { id: args.id },
        relations: {
          user: true,
          event: {
            creator: true,
          },
        },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      return transformBooking(booking);
    } catch (err) {
      console.error("Error fetching booking:", err);
      throw err;
    }
  },

  createBooking: async (args , req) => {
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const bookingRepository = datasource.getRepository(Booking);
      const eventRepository = datasource.getRepository(Event);
      const userRepository = datasource.getRepository(User);

      const event = await eventRepository.findOne({
        where: { id: args.eventId },
        relations: { creator: true },
      });

      const user = await userRepository.findOneBy({
        id: req.userId,
      });

      if (!event) throw new Error("Event not found");
      if (!user) throw new Error("User not found");

      const newBooking = bookingRepository.create({
        event,
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const createdBooking = await bookingRepository.save(newBooking);
      return transformBooking(createdBooking);
    } catch (err) {
      console.error("Error creating booking:", err);
      throw err;
    }
  },

  

  cancelBooking: async (args , req) => {
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const bookingRepository = datasource.getRepository(Booking);
      const eventRepository = datasource.getRepository(Event);

      const booking = await bookingRepository.findOne({
        where: { id: args.bookingId },
        relations: {
          event: true,
          user: true,
        },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      const eventId = booking.event.id;

      await bookingRepository.remove(booking);

      return await eventRepository.findOne({
        where: { id: eventId },
        relations: {
          creator: true,
          bookings: {
            user: true,
          },
        },
      });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      throw err;
    }
  },


}
