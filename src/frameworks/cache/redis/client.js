import Client from "../../../application/cache/client.js";
import { createClient } from "redis";
import APITokenCache from "./apiToken.js";

export let redisClient = null;

export default class RedisClient extends Client {
    constructor({ logger, config }) {
        super({ logger, config });
        this.apiTokenCache = new APITokenCache({ logger, config });
    }

    async Create() {
        if (redisClient) {
            return redisClient;
        }

        console.log(this.config.redisURI);

        // redisClient = createClient({ url: this.config.redisURI });

        // redisClient.on("error", error => {
        //     this.logger.error("Redis error", error);
        // });

        // redisClient.on("end", () => {
        //     this.logger.info("Redis disconnected");
        // });

        // redisClient.on("connect", () => {
        //     this.logger.info("Redis connected");
        // });

        // await redisClient.connect();
        this.logger.info("Redis created");
        return redisClient;
    }
}
