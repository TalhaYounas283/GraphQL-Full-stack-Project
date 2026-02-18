const {DataSource} = require("typeorm");
const Event = require("../Entity/Event");
const User = require("../Entity/User");
const Booking = require("../Entity/booking");
const datasource = new DataSource({
    type:"postgres",
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    entities: [Event, User, Booking],
    synchronize:true,
})

module.exports = datasource