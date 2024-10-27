import { convertToObjectId, parseQuery } from "../utils.js";
import { Pagination } from "../../../../entities/index.js";

class Base {
    constructor(model) {
        this.Model = model;
    }

    async find(query = {}, { select = "", sort = null, populate = null, rules = [] } = {}) {
        query = parseQuery(query, [...rules, "id-_id", "r-createdAt", "r-updatedAt"]);

        sort = sort || {
            createdAt: -1,
        };

        const res = await this.Model.find(query).select(select).sort(sort).populate(populate);

        // convert to object
        return res.map(r => ({ ...r.toObject(), _id: r.toObject()["_id"].toString() }));
    }

    async findOne(query = {}, { select = "", populate = null, sort = null, rules = [] } = {}) {
        query = parseQuery(query, [...rules, "id-_id", "r-createdAt", "r-updatedAt"]);

        populate = populate || "";

        sort = sort || {
            createdAt: 1,
        };

        const res = await this.Model.findOne(query).select(select).populate(populate).sort(sort);

        return res ? { ...res.toObject(), _id: res.toObject()["_id"].toString() } : null;
    }

    async findById(id, { select = "" } = {}) {
        return this.findOne({ _id: convertToObjectId(id) }, { select });
    }

    async paginate(
        query = {},
        { pagination: { count = 15, page = 1, sort = -1 } = {}, populate = null, select = null, rules = [] } = {},
    ) {
        query = parseQuery(query, [...rules, "id-_id", "r-createdAt", "r-updatedAt"]);

        const options = {
            limit: count,
            page: page,
            sort: sort,
        };

        if (populate) {
            options.populate = populate;
        }

        if (select) {
            options.select = select;
        }

        const res = await this.Model.paginate(query, options);

        return new Pagination({
            data: res.docs.map(r => ({ ...r.toObject(), _id: r.toObject()["_id"].toString() })),
            total: res.totalDocs,
            page: res.page,
            limit: res.limit,
            total_pages: res.totalPages,
            paging_counter: res.pagingCounter,
            has_prev_page: res.hasPrevPage,
            has_next_page: res.hasNextPage,
            prev_page: res.prevPage,
            next_page: res.nextPage,
        });
    }

    async paginateAggregate(pipeline = [], { pagination: { count = 15, page = 1, sort = -1 } = {} } = {}) {
        count = count || 15;
        page = page || 1;
        sort = sort || {
            createdAt: -1,
        };

        const res = await this.Model.aggregatePaginate(this.Model.aggregate(pipeline), {
            limit: count,
            page: page,
            sort: sort,
        });

        return new Pagination({
            data: res.docs,
            total: res.totalDocs,
            page: res.page,
            limit: res.limit,
            total_pages: res.totalPages,
            paging_counter: res.pagingCounter,
            has_prev_page: res.hasPrevPage,
            has_next_page: res.hasNextPage,
            prev_page: res.prevPage,
            next_page: res.nextPage,
        });
    }

    async aggregate(pipeline = []) {
        return await this.Model.aggregate(pipeline);
    }

    async create(data) {
        const res = await this.Model.create({
            ...data,
            deleted: false,
        });

        return { ...res.toObject(), _id: res.toObject()["_id"].toString() };
    }

    async countDocuments(query = {}, { rules = [] }) {
        query = parseQuery(query, [...rules, "id-_id", "r-createdAt", "r-updatedAt"]);
        return await this.Model.countDocuments(query);
    }

    async bulkWrite(operations) {
        return await this.Model.bulkWrite(operations);
    }

    getModel() {
        return this.Model;
    }

    getModelName() {
        return this.Model.collection.name;
    }

    async findOneAndUpdate(query = {}, data, {}, { sort = null, rules = [] } = {}) {
        query = parseQuery(query, [...rules, "id-_id", "r-createdAt", "r-updatedAt"]);

        sort = sort || {
            createdAt: 1,
        };

        const res = await this.Model.findOneAndUpdate(
            query,
            {
                $set: data,
            },
            {
                new: true,
                sort: sort,
            },
        );

        return res ? { ...res.toObject(), _id: res.toObject()["_id"].toString() } : null;
    }

    async findOneAndDelete(query = {}, { sort = null, rules = [] } = {}) {
        return await this.findOneAndUpdate(query, { deleted: true }, { sort, rules });
    }

    async deleteMany(query = {}, { rules = [] }) {
        query = parseQuery(query, [...rules, "id-_id", "r-createdAt", "r-updatedAt"]);
        return await this.Model.updateMany(query, {
            $set: {
                deleted: true,
            },
        });
    }

    getHiddenFields() {
        const schema = this.Model.schema.obj;
        const fields = Object.keys(schema);
        const res = [];

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (schema[field].select === false) {
                res.push(field);
            }
        }

        return res;
    }
}

export default Base;
