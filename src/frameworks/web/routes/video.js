import express from "express";
import VideoController from "../controllers/video.js";

export default (app, dependencies) => {
    const router = express.Router();
    const controller = new VideoController(dependencies);

    app.use("/video", router);

    router.get("/details/:videoId", controller.getVideo.bind(controller));

    router.get("/comments", controller.getComments.bind(controller));
};
