const Event = require("../../Entity/Event");
const { formatEventDate } = require("../../utilites/date.helper");
const datasource = require("../../db-config/data-source");
const User = require("../../Entity/User");
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

      return events.map(event => ({
        ...event,
        date: formatEventDate(event.date),
      }));
    } catch (err) {
      console.error("Error fetching events:", err);
      throw err;
    }
  },

  createEvent: async (args , req) => {
    try {
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

      return await eventRepository.save(newEvent);
    } catch (err) {
      console.error("Error creating event:", err);
      throw err;
    }
  },

  updateEvent:async(args , req)=>{
    try{
       if(!req.isAuth){
      throw new Error("Unauthenticated!");
    }
    const eventRepository = datasource.getRepository(Event);
    const event = await eventRepository.findOneBy({
      id: args.eventId,
    });
    if (!event) {
      throw new Error("Event not found");
    }
    event.title = args.eventInput.title;
    event.description = args.eventInput.description;
    event.price = args.eventInput.price;
    event.date = new Date(args.eventInput.date);
    return await eventRepository.save(event);
    }
    catch(err){
      console.error("Error updating event:", err);
      throw err;
    }
  },

  deleteEvent:async(args , req)=>{
    try{
       if(!req.isAuth){
      throw new Error("Unauthenticated!");
    }
    const eventRepository = datasource.getRepository(Event);
    const event = await eventRepository.findOneBy({
      id: args.eventId,
    });
    if (!event) {
      throw new Error("Event not found");
    }
    await eventRepository.remove(event);
    return true;
    }
    catch(err){
      console.error("Error deleting event:", err);
      throw err;
    }
  }
    
}

