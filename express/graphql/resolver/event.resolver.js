const Event = require("../../Entity/Event");
const { formatEventDate } = require("../../utilites/date.helper");
const datasource = require("../../db-config/data-source");
const User = require("../../Entity/User");
const Booking = require("../../Entity/booking");
const { transformEvent } = require("./merge");

module.exports = {
events: async () => {
    try {
      const events = await datasource.getRepository(Event).find({
        relations: {
          creator: {
            bookings: {
              user: true,
            },
          },
          bookings: {
            user: true,
          },
        },
      });

      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      console.error("Error fetching events:", err);
      throw err;
    }
  },

  createEvent: async (args , context) => {
    try {
    const { req } = context;
    if(!req.isAuth){
      throw new Error("Unauthenticated!");
    }
      const eventRepository = datasource.getRepository(Event);
      const userRepository = datasource.getRepository(User);

      const creator = await userRepository.findOneBy({
        id: args.eventInput.creatorId,
      });

      if (!creator) {
        throw new Error("User not found");
      }

      const newEvent = eventRepository.create({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator:req.userId
      });

      const createdEvent = await eventRepository.save(newEvent);
      return transformEvent(createdEvent);
    } catch (err) {
      console.error("Error creating event:", err);
      throw err;
    }
  },

  updateEvent:async(args , context)=>{
    try{
       const { req } = context;
       if(!req.isAuth){
      throw new Error("Unauthenticated!");
    }
    const eventRepository = datasource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: { id: args.eventId },
      relations: { creator: true }
    });
    if (!event) {
      throw new Error("Event not found");
    }

    if (req.user?.role !== "ADMIN" && event.creator.id !== req.userId) {
      throw new Error("Unauthorized!");
    }

    event.title = args.eventInput.title;
    event.description = args.eventInput.description;
    event.price = args.eventInput.price;
    event.date = new Date(args.eventInput.date);
    const updatedEvent = await eventRepository.save(event);
    return transformEvent(updatedEvent);
    }
    catch(err){
      console.error("Error updating event:", err);
      throw err;
    }
  },

  deleteEvent:async(args , context)=>{
    try{
       const { req } = context;
       if(!req.isAuth){
      throw new Error("Unauthenticated!");
    }
    const eventRepository = datasource.getRepository(Event);
    const bookingRepository = datasource.getRepository(Booking);

    const event = await eventRepository.findOne({
      where: { id: args.eventId },
      relations: { creator: true }
    });
    
    if (!event) {
      throw new Error("Event not found");
    }

    if (req.user?.role !== "ADMIN" && event.creator.id !== req.userId) {
      throw new Error("Unauthorized!");
    }

    // Manually delete bookings first to avoid foreign key constraints issues
    await bookingRepository.delete({ event: { id: args.eventId } });

    await eventRepository.remove(event);
    return true;
    }
    catch(err){
      console.error("Error deleting event:", err);
      throw err;
    }
  }
    
}
