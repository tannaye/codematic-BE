import AuthUseCase from "../../../application/use_cases/auth.js";
import BaseMiddleware from "./base.js";
import { UnauthorizedError } from "../../../entities/error.js";

export default class AuthMiddleware extends BaseMiddleware {
    constructor({
        logger,
        databaseService: { userRepository },
        cacheService: { apiTokenCache },
        authService,
        cryptService,
    }) {
        super({ logger });
        this.authUseCase = new AuthUseCase({ logger, userRepository, authService, cryptService, apiTokenCache });
    }

    async authenticate(req, res, next) {
        const { authorization, "x-api-token": apiToken } = req.headers;
        if (!authorization) {
            throw new UnauthorizedError("Missing authorization header");
        }

        if (!apiToken) {
            throw new UnauthorizedError("Missing api token header");
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError("Missing token");
        }

        try {
            req.user = await this.authUseCase.authenticate(token, apiToken);
            next();
        } catch (e) {
            this.handleError(e, req, res, next);
        }
    }
}
