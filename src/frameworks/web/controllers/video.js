import BaseController from "./base.js";
import VideoUseCase from "../../../application/use_cases/video.js";

export default class VideoController extends BaseController {
    constructor({ logger, validatorService: { videoValidator } }) {
        super({ logger });
        this.videoUseCase = new VideoUseCase({
            logger,
            videoValidator,
        });
    }

    async getVideo(req, res) {
        try {
            const { videoId } = req.params;
            const data = await this.videoUseCase.getVideo(videoId);
            this.handleSuccess(res, data);
        } catch (e) {
            this.handleError(res, e);
        }
    }

    async getComments(req, res) {
        try {
            const data = await this.videoUseCase.getComments(req.query);
            this.handleSuccess(res, data);
        } catch (e) {
            this.handleError(res, e);
        }
    }
}
