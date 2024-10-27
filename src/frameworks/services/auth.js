import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthServiceInterface from "../../application/services/auth.js";

export default class AuthService extends AuthServiceInterface {
    constructor({ logger, config }) {
        super({ logger, config });
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    async verifyToken(token) {
        return jwt.verify(token, this.config.jwtSecret);
    }

    async generateToken(payload, time = 720 * 4) {
        return jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: time,
            algorithm: "ES256",
        });
    }
}
