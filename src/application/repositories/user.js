export default class UserRepository {
    constructor({ logger }) {
        this.logger = logger;
    }

    async create(user) {
        return Promise.reject(new Error("not implemented"));
    }

    async find(filter, opts) {
        return Promise.reject(new Error("not implemented"));
    }

    async findOne(filter, opts) {
        return Promise.reject(new Error("not implemented"));
    }

    async findById(id, opts) {
        return Promise.reject(new Error("not implemented"));
    }

    async findOneAndUpdate(filter, update, opts) {
        return Promise.reject(new Error("not implemented"));
    }

    async findOneAndDelete(filter, opts) {
        return Promise.reject(new Error("not implemented"));
    }

    async list(filter, opts) {
        return Promise.reject(new Error("not implemented"));
    }
}
