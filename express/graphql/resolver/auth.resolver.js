const bycrypt = require("bcryptjs");
const datasource = require("../../db-config/data-source");
const User = require("../../Entity/User");
const jwt = require("jsonwebtoken");
module.exports = {
    login: async ({email, password}) => {
        try {
            const userRepository = datasource.getRepository(User);
            const user = await userRepository.findOneBy({ email });
            
            if (!user) {
                throw new Error("User not found");
            }
            
            const isPasswordValid = await bycrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            
            const payload = {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
            return {
                userId: user.id,
                token:token,
                tokenExpiration: 1,
            };
        } catch (error) {
            throw error;
        }
    }
}
