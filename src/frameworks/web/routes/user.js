import express from "express";
import UserController from "../controllers/user.js";

export default (app, dependencies) => {
    const router = express.Router();
    const controller = new UserController(dependencies);

    app.use("/user", router);

    router.post("/register", controller.register.bind(controller));
};
