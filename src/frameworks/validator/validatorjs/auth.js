import AuthValidatorInterface from "../../../application/validations/auth.js";
import { ValidationError } from "../../../entities/error.js";
import Base from "./base.js";
import User from "../../../entities/user.js";

export default class AuthValidator extends AuthValidatorInterface {
    constructor({ logger }) {
        super({ logger });
        this.base = new Base();
    }

    validateLogin(user) {
        this.base.validate(user, User.loginRules(), (errs, status) => {
            if (!status) {
                throw new ValidationError("Validation Error", errs.errors);
            }
        });
    }
}
