export default class AuthService {
    constructor({ logger, config }) {
        this.logger = logger;
        this.config = config;
    }

    async hashPassword(password) {
        return Promise.reject(new Error("not implemented"));
    }

    async comparePassword(password, hashedPassword) {
        return Promise.reject(new Error("not implemented"));
    }

    async verifyToken(token) {
        return Promise.reject(new Error("not implemented"));
    }

    async generateToken(payload) {
        return Promise.reject(new Error("not implemented"));
    }
}
