import { ValidationError } from "../../../entities/error.js";
import Base from "./base.js";
import Video from "../../../entities/video.js";

export default class VideoValidator {
    constructor({ logger }) {
        this.base = new Base();
    }

    validateGetDetails(videoId) {
        this.base.validate(videoId, Video.getDetailsRules(), (errs, status) => {
            if (!status) {
                throw new ValidationError("Validation Error", errs.errors);
            }
        });
    }

    validateGetComments(query) {
        this.base.validate(query, Video.getCommentsRules(), (errs, status) => {
            if (!status) {
                throw new ValidationError("Validation Error", errs.errors);
            }
        });
    }
}
