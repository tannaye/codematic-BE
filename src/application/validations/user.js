export default class UserValidator {
    constructor({ logger }) {
        this.logger = logger;
    }

    validateCreate(user) {
        return Promise.reject(new Error("Not implemented"));
    }

    validateUpdate(user) {
        return Promise.reject(new Error("Not implemented"));
    }
}
