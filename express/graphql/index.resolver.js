const eventResolver = require("./resolver/event.resolver");
const userResolver = require("./resolver/user.resolver");
const bookingResolver = require("./resolver/bookings.resolver");
const authResolver = require("./resolver/auth.resolver");

module.exports = {
    ...eventResolver,
    ...userResolver,
    ...bookingResolver,
    ...authResolver,
}