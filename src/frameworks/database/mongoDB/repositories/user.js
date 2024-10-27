import UserRepo from "../../../../application/repositories/user.js";
import UserModel from "../models/user.js";
import Base from "./base.js";
import User from "../../../../entities/user.js";

export default class UserRepository extends UserRepo {
    constructor({ logger }) {
        super({ logger });
        this.base = new Base(UserModel);
    }

    async create(user) {
        return new User(await this.base.create(user));
    }

    async find(filter, opts) {
        const users = await this.base.find(filter, opts);
        return users.map(u => new User(u));
    }

    async findOne(filter, opts) {
        const user = await this.base.findOne(filter, opts);
        return user ? new User(user) : null;
    }

    async findById(id, opts) {
        const user = await this.base.findById(id, opts);
        return user ? new User(user) : null;
    }

    async findOneAndUpdate(filter, update, opts) {
        const user = await this.base.findOneAndUpdate(filter, update, opts);
        return user ? new User(user) : null;
    }

    async findOneAndDelete(filter, opts) {
        const user = await this.base.findOneAndDelete(filter, opts);
        return user ? new User(user) : null;
    }

    async list(filter, opts) {
        // TODO: implement pagination
        return Promise.reject(new Error("not implemented"));
    }
}
