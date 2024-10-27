export default class Client {
    constructor({ logger, config }) {
        this.apiTokenCache = null;
        this.logger = logger;
        this.config = config;
    }

    async Create() {
        return Promise.reject(new Error("Not implemented"));
    }
}
