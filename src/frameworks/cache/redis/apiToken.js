import APITokenCacheInterface from "../../../application/cache/apiToken.js";
import { redisClient } from "./client.js";

export default class APITokenCache extends APITokenCacheInterface {
    constructor({ logger, config }) {
        super({ logger, config });
        this.oneDayInSeconds = 60 * 60 * 24;
    }

    async setToken({ token, exp = this.oneDayInSeconds, data }) {
        await redisClient.setEx(`api_token_${token}`, exp, JSON.stringify(data));
    }

    async getToken(token) {
        const get = await redisClient.get(`api_token_${token}`);
        if (!get) return null;
        return JSON.parse(get);
    }

    async deleteToken(token) {
        await redisClient.del(`api_token_${token}`);
    }
}
