export default class APITokenCache {
    constructor({ logger, config }) {
        this.logger = logger;
        this.config = config;
    }

    setToken({ token, exp, data }) {
        return Promise.reject(new Error("Not implemented"));
    }

    getToken(token) {
        return Promise.reject(new Error("Not implemented"));
    }

    deleteToken(token) {
        return Promise.reject(new Error("Not implemented"));
    }
}
