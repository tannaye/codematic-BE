import ValidatorInterface from "../../../application/validations/validator.js";
import Base from "./base.js";
import UserValidator from "./user.js";
import AuthValidator from "./auth.js";
import VideoValidator from "./video.js";

export default class Validator extends ValidatorInterface {
    constructor({ logger }) {
        super({ logger });
        Base.registerCustomRules();

        this.userValidator = new UserValidator({ logger });
        this.authValidator = new AuthValidator({ logger });
        this.videoValidator = new VideoValidator({ logger });
    }
}
