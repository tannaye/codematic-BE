import MongoDB from "../frameworks/database/mongoDB/db.js";
import RedisClient from "../frameworks/cache/redis/client.js";
import logger from "../frameworks/services/logger.js";
import Auth from "../frameworks/services/auth.js";
import Crypt from "../frameworks/services/crypt.js";
import ValidatorJS from "../frameworks/validator/validatorjs/validator.js";
import config from "./env.js";

export default (() => {
    return {
        logger: logger,
        databaseService: new MongoDB({ logger, config }),
        cacheService: new RedisClient({ logger, config }),
        authService: new Auth({ logger, config }),
        cryptService: new Crypt({ logger, config }),
        validatorService: new ValidatorJS({ logger }),
    };
})();
