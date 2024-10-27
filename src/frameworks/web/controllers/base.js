export default class BaseController {
    constructor({ logger }) {
        this.logger = logger;
    }

    handleSuccess(res, data, code = 200, message = "Success") {
        if (res.headersSent) return;

        res.status(code).json({
            error: false,
            message,
            code,
            data,
        });
    }

    handleError(res, err, code = 500, message = "Internal Server Error") {
        if (res.headersSent) return this.logger.error(err);

        code = err.code || code;
        message = err.message || message;
        const errors = err.errors || undefined;

        this.logger.error(err);
        res.status(code).json({
            error: true,
            message,
            errors,
            code,
        });
    }
}
