import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { ForbiddenError } from "../../entities/error.js";
import routes from "./routes/index.js";
import BaseMiddleware from "./middlewares/base.js";

export default class App {
    constructor({ dependencies, config }) {
        this.dependencies = dependencies;
        this.config = config;
        this.server = express();
        this.routes = routes(dependencies);
        this.middlewares = new BaseMiddleware({ logger: dependencies.logger });
        this.registerMiddlewares();
        this.registerHandlers();
    }

    getRateLimitOptions() {
        return {
            windowMs: 60 * 1000, // 1 minutes
            max: 30, // Limit each IP to 30 requests per `window` (here, per minute)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        };
    }

    getCorsOptions() {
        if (this.config.allowedOrigins.includes("*")) {
            return { origin: "*" };
        } else {
            return {
                origin: function (origin, callback) {
                    if (this.config.allowedOrigins.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        const error = new Error("Not allowed by CORS");
                        error.status = 403; // Set the error status to 403 Forbidden
                        callback(error);
                    }
                },
            };
        }
    }

    registerMiddlewares() {
        // this.server.enable("trust proxy");
        this.server.use(rateLimit(this.getRateLimitOptions()));
        this.server.use(cors(this.getCorsOptions()));
        this.server.use(express.json());
        this.server.use((req, res, next) => {
            if (!this.config.allowedOrigins.includes("*")) {
                const referer = req.headers.referer || req.headers.referrer;
                if (!this.config.allowedOrigins.includes(new URL(referer).origin)) {
                    throw new ForbiddenError("Forbidden");
                }
            }
            next();
        });
        this.server.use(this.middlewares.logRequest.bind(this.middlewares));
    }

    registerHandlers() {
        this.server.get("/", (req, res) => {
            res.json({ message: "Hi stranger", error: false });
        });

        this.server.get("/status", (req, res) => {
            res.status(200).end();
        });

        this.server.head("/status", (req, res) => {
            res.status(200).end();
        });

        this.server.use(this.config.api.prefix, this.routes);
        this.server.use(this.middlewares.handleError.bind(this.middlewares));
        this.server.use(this.middlewares.handleNotFound.bind(this.middlewares));
    }

    getServer() {
        return this.server;
    }
}
