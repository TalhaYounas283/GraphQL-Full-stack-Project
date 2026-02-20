
const User = require("../../Entity/User");
const { formatEventDate } = require("../../utilites/date.helper");
const datasource = require("../../db-config/data-source");
const bycrypt = require("bcryptjs");
const { transformUser } = require("./merge");
module.exports = {
 users: async () => {
    try {
      const users = await datasource.getRepository(User).find({
        relations: {
          events: true,
          bookings: {
            event: true,
          },
        },
      });

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      throw err;
    }
  },
   
  createUser: async (args) => {
    try {
      const userRepository = datasource.getRepository(User);
    const salt = parseInt(process.env.SALT) || 10;
      const hashedPassword = await bycrypt.hash(args.userInput.password, salt);
      const newUser = userRepository.create({
        name: args.userInput.name,
        email: args.userInput.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await userRepository.save(newUser);
      return transformUser(user);
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  },
  getUserById : async (args , req)=>{
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const userRepository = datasource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: args.userId,
      });
      if (!user) {
        throw new Error("User not found");
      }
      return transformUser(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  },

  deleteUser: async (args , req) => {
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const userRepository = datasource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: args.userId,
      });
      if (!user) {
        throw new Error("User not found");
      }
      await userRepository.remove(user);
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  },

  updateUser: async (args , req) => {
    try {
      if(!req.isAuth){
        throw new Error("Unauthenticated!");
      }
      const userRepository = datasource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: args.userId,
      });
      if (!user) {
        throw new Error("User not found");
      }
      user.name = args.userInput.name;
      user.email = args.userInput.email;
      const salt = parseInt(process.env.SALT) || 10;
      user.password = await bycrypt.hash(args.userInput.password, salt);
      user.updatedAt = new Date();
      const updatedUser = await userRepository.save(user);
      return transformUser(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  },
}