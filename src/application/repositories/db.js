export default class Database {
    constructor({ logger, config }) {
        this.userRepository = null;
        this.logger = logger;
        this.config = config;
    }

    async connect() {
        return Promise.reject(new Error("Not implemented"));
    }

    async disconnect() {
        return Promise.reject(new Error("Not implemented"));
    }
}
