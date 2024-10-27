import BaseController from "./base.js";
import UserUseCase from "../../../application/use_cases/user.js";

export default class UserController extends BaseController {
    constructor({ logger, databaseService: { userRepository }, validatorService: { userValidator }, authService }) {
        super({ logger });
        this.userUseCase = new UserUseCase({ logger, userRepository, userValidator, authService });
    }

    async register(req, res) {
        try {
            const user = await this.userUseCase.createUser(req.body);
            this.handleSuccess(res, user);
        } catch (e) {
            this.handleError(res, e);
        }
    }
}
