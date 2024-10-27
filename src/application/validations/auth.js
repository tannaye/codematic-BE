export default class AuthValidator {
    constructor({ logger }) {
        this.logger = logger;
    }

    validateLogin(user) {
        return Promise.reject(new Error("Not implemented"));
    }
}
