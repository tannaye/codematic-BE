import { Router } from "express";
import auth from "./auth.js";
import user from "./user.js";
import video from "./video.js";

export default dependencies => {
    const route = Router();

    auth(route, dependencies);
    user(route, dependencies);
    video(route, dependencies);

    return route;
};
