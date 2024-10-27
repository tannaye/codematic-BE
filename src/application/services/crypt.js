export default class CryptService {
    constructor({ logger, config }) {
        this.logger = logger;
        this.config = config;
    }

    encrypt(data, channel = "internal") {
        return Promise.reject(new Error("not implemented"));
    }

    decrypt(data, channel = "internal") {
        return Promise.reject(new Error("not implemented"));
    }
}
