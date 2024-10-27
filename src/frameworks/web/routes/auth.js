import express from "express";
import AuthController from "../controllers/auth.js";

export default (app, dependencies) => {
    const router = express.Router();
    const controller = new AuthController(dependencies);

    app.use("/auth", router);

    router.post("/login", controller.login.bind(controller));
};
