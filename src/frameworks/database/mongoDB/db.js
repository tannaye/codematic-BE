import Database from "../../../application/repositories/db.js";
import UserRepository from "./repositories/user.js";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

export default class MongoDB extends Database {
    constructor({ logger, config }) {
        super({ logger, config });
        this.userRepository = new UserRepository({ logger });
    }

    async connect() {
        let count = 0;

        while (count <= 6) {
            try {
                // await mongoose.connect(this.config.mongodbURI, {});
                this.logger.info("DB Connection successful!");
                break;
            } catch (e) {
                this.logger.error("database connection error, retrying...", e);
                count += 1;
                if (count > 5) {
                    this.logger.error("database connection error, not retrying", e);
                    throw e;
                }

                const backoff = Math.pow(2, count);
                await new Promise(resolve => setTimeout(resolve, backoff * 1000));
                this.logger.debug("backing off for " + backoff + " seconds");
            }
        }
    }

    async disconnect() {
        await mongoose.disconnect();
    }
}
