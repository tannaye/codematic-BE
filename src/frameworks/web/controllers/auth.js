import BaseController from "./base.js";
import AuthUseCase from "../../../application/use_cases/auth.js";

export default class AuthController extends BaseController {
    constructor({
        logger,
        authService,
        cryptService,
        databaseService: { userRepository },
        cacheService: { apiTokenCache },
        validatorService: { authValidator },
    }) {
        super({ logger });
        this.authUseCase = new AuthUseCase({
            logger,
            userRepository,
            authService,
            cryptService,
            apiTokenCache,
            authValidator,
        });
    }

    async login(req, res) {
        try {
            const { email, password, role } = req.body;
            const data = await this.authUseCase.login({ email, password, role });
            this.handleSuccess(res, data);
        } catch (e) {
            this.handleError(res, e);
        }
    }
}
