import dotenv from "dotenv";
const env = dotenv.config({ path: `./.env` });

// Set the NODE_ENV to 'development' by default..
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

if (env.error && !process.env.NODE_ENV.toLowerCase().includes("prod")) {
    dotenv.config({ path: `./.env.${process.env.NODE_ENV.toLowerCase()}` });
}

export const parsePemKey = key => {
    return key.split("\\n").join("\n");
};

export const port = parseInt(process.env.PORT, 10) || 3000;
export const jwtSecret = parsePemKey(process.env.JWT_SECRET);
export const mongodbURI = process.env.MONGO_URI;
export const redisURI = process.env.REDIS_URI;
export const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
export const encryptionKey = process.env.ENCRYPTION_KEY;
export const externalEncryptionKey = process.env.EXTERNAL_ENCRYPTION_KEY;
export const api = {
    prefix: "/api/v1",
};

export default {
    port,
    jwtSecret,
    mongodbURI,
    redisURI,
    allowedOrigins,
    encryptionKey,
    externalEncryptionKey,
    api,
};
