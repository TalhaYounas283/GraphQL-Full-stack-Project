module.exports.formatEventDate = (date) => {
    const eventDate = new Date(date);
    return eventDate.toISOString().split("T")[0];
};