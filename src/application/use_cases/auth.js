import APITokenUseCase from "./apiToken.js";
import User from "../../entities/user.js";
import { UnauthorizedError, BadRequestError } from "../../entities/error.js";

export default class AuthUseCase {
    constructor({ logger, userRepository, authService, cryptService, apiTokenCache, authValidator }) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.cryptService = cryptService;
        this.authValidator = authValidator;
        this.logger = logger;
        this.apiTokenUseCase = new APITokenUseCase({ logger, apiTokenCache });
    }

    async authenticate(token, apiToken) {
        let data = await this.authService.verifyToken(token);

        if (!data && !data.data) {
            throw new UnauthorizedError("Invalid token");
        }

        data = this.cryptService.decrypt(data.data);

        const { id } = data;

        if (!id) {
            throw new UnauthorizedError("Invalid token");
        }

        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UnauthorizedError("Invalid token");
        }

        const apiTokenData = await this.apiTokenUseCase.validateToken(apiToken);
        if (!apiTokenData) {
            throw new UnauthorizedError("Invalid api token");
        }

        if (apiTokenData.user_id !== id) {
            throw new UnauthorizedError("Invalid api token");
        }

        return user;
    }

    async login(userData) {
        this.authValidator.validateLogin(userData);

        const { email, password, role } = userData;

        if (!role) {
            userData.role = User.CUSTOMER;
        }

        // get user by email
        const user = await this.userRepository.findOne({ email, role: userData.role }, { select: "+password" });
        if (!user) {
            throw new BadRequestError("Invalid email or password");
        }

        // check if password is correct
        const isValidPassword = await this.authService.comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new BadRequestError("Invalid email or password");
        }

        // generate token
        const token = await this.authService.generateToken({ data: this.cryptService.encrypt({ id: user._id.toString() }) });

        // generate api token
        const apiToken = await this.apiTokenUseCase.createToken({ user_id: user._id.toString() });

        // remove password from user object
        delete user.password;

        return { user, token, api_token: apiToken };
    }
}
