export default class Validator {
    constructor({ logger }) {
        this.logger = logger;
        this.UserValidator = null;
        this.authValidator = null;
    }
}
