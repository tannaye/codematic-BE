import Validator from "validatorjs";
import phone from "phone";
const { register } = Validator;
import { flattenObjectKeys, setObjectValueByFlattenedKey } from "./utils.js";

export default class Base {
    constructor() {}

    validate(data, rules, cb) {
        const validator = new Validator(data, rules);
        const bodyKeys = flattenObjectKeys({ ...data });

        for (const key of bodyKeys) {
            if (validator.rules[key] === undefined) {
                // some checks
                const rule = key.split(".")[0];
                if (validator.rules[rule] !== undefined) {
                    if (
                        validator._hasRule(rule, ["array"]) ||
                        JSON.stringify(validator.rules[rule]) === JSON.stringify([])
                    ) {
                        continue;
                    }
                }
                validator.errors.add(key, "The " + key + " field is not allowed.");
                cb(validator.errors, false);
                return;
            }

            if (validator._hasNumericRule(key)) {
                const value = validator._objectPath(data, key);
                if (value !== undefined && value !== null && value !== "") {
                    if (isNaN(value)) {
                        validator.errors.add(key, "The " + key + " field must be a number.");
                        cb(validator.errors, false);
                        return;
                    } else {
                        setObjectValueByFlattenedKey(data, key, Number(value));
                    }
                }
            }
        }

        validator.passes(() => cb(null, true));
        validator.fails(() => cb(validator.errors, false));
    }

    static registerCustomRules() {
        // register custom rules
        register(
            "json",
            value => {
                try {
                    JSON.parse(value);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            "The :attribute must be a valid JSON string.",
            null,
        );

        register(
            "phone",
            value => {
                let isPhoneValid = phone.phone(value);
                return isPhoneValid.isValid;
            },
            "invalid phone number provided, please provide a phone number in the international format",
            null,
        );
    }
}
