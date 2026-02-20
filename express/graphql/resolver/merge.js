const Event = require("../../Entity/Event");
const User = require("../../Entity/User");
const DataLoader = require("dataloader");
const { In } = require("typeorm");
const datasource = require("../../db-config/data-source");
const { formatEventDate } = require("../../utilites/date.helper");

const transformEvent = (event) => {
  return {
    ...event,
    date: formatEventDate(event.date),
  };
};

const transformUser = (user) => {
  return {
    ...user,
    createdAt: formatEventDate(user.createdAt),
    updatedAt: formatEventDate(user.updatedAt),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking,
    createdAt: formatEventDate(booking.createdAt),
    updatedAt: formatEventDate(booking.updatedAt),
  };
};

const eventLoader = new DataLoader(async (eventIds) => {
  const events = await datasource.getRepository(Event).find({
    where: { id: In(eventIds) },
  });
  const eventItems = eventIds.map((eventId) => {
    return events.find((event) => event.id === eventId) || null;
  });
  return eventItems.map(transformEvent);
});

const userLoader = new DataLoader(async (userIds) => {
  const users = await datasource.getRepository(User).find({
    where: { id: In(userIds) },
  });
  const userItems = userIds.map((userId) => {
    return users.find((user) => user.id === userId) || null;
  });
  return userItems.map(transformUser);
});

module.exports = {
  eventLoader,
  userLoader,
  transformEvent,
  transformUser,
  transformBooking,
};
