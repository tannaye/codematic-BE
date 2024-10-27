import http_status from "http-status";
const { BAD_REQUEST, METHOD_NOT_ALLOWED, NOT_FOUND, UNAUTHORIZED, PRECONDITION_FAILED, FORBIDDEN } = http_status;

export class GlobalError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends GlobalError {
    constructor(message) {
        super(message, BAD_REQUEST);
    }
}

export class ValidationError extends GlobalError {
    constructor(message, errors) {
        super(message, PRECONDITION_FAILED);
        this.errors = errors;
    }
}

export class UnauthorizedError extends GlobalError {
    constructor(message) {
        super(message, UNAUTHORIZED);
    }
}

export class NotFoundError extends GlobalError {
    constructor(message) {
        super(message, NOT_FOUND);
    }
}

export class MethodNotAllowedError extends GlobalError {
    constructor(message) {
        super(message, METHOD_NOT_ALLOWED);
    }
}

export class ForbiddenError extends GlobalError {
    constructor(message) {
        super(message, FORBIDDEN);
    }
}
