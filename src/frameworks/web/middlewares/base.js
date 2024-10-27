export default class BaseMiddleware {
    constructor({ logger }) {
        this.logger = logger;
    }

    handleError(err, req, res, next) {
        const response = {
            error: true,
            message: err.message || "Internal Server Error",
            code: err.code || 500,
        };

        switch (err.name) {
            case "ValidationError":
                response.errors = err.errors;
                break;
        }

        this.logger.error(err);
        res.status(response.code).json(response);
    }

    handleNotFound(req, res, next) {
        res.status(404).json({
            message: "Not Found",
            error: true,
            code: 404,
        });
    }

    logRequest(req, res, next) {
        this.logger.info(`${req.method} ${req.originalUrl}`);
        next();
    }
}
