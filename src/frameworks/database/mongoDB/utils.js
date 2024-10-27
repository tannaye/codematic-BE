import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const nilObjectId = () => {
    return new ObjectId("000000000000000000000000");
};

export const convertToObjectId = id => {
    try {
        return new ObjectId(id);
    } catch (error) {
        return id;
    }
};

export const lookup = (localKey, foreignKey, as, coll, queries = {}, project = null, pipeline_ = null) => {
    let matchQuery = {
        ...queries,
        deleted: false,
        $expr: {
            $eq: ["$" + foreignKey, "$$id"],
        },
    };

    let pipeline = [];
    let afterMatchPipeline = [];

    if (pipeline_) {
        if (pipeline_.length > 0) {
            for (let i = 0; i < pipeline_.length; i++) {
                if (Object.keys(pipeline_[i])[0].slice(0, 2) !== "$$") {
                    pipeline.push(pipeline_[i]);
                } else {
                    // convert the $$ to $
                    const newPipeline = {};
                    for (let key in pipeline_[i]) {
                        newPipeline[key.slice(1)] = pipeline_[i][key];
                    }
                    afterMatchPipeline.push(newPipeline);
                }
            }
        }
    }

    pipeline.push({
        $match: matchQuery,
    });

    if (afterMatchPipeline.length > 0) {
        pipeline = pipeline.concat(afterMatchPipeline);
    }

    if (project) {
        if (project.length > 0) {
            pipeline.push({
                $project: projectQuery(project),
            });
        }
    }

    return {
        $lookup: {
            from: coll,
            let: {
                id: "$" + localKey,
            },
            pipeline,
            as,
        },
    };
};

export const lookupMultiple = (localKey, foreignKey, as, coll, queries = {}, project = null, pipeline_ = null) => {
    let matchQuery = {
        deleted: false,
        $expr: {
            $in: ["$" + foreignKey, "$$ids"],
        },
        ...queries,
    };

    // check if foreignKey is an array
    if (foreignKey.includes("_arr")) {
        matchQuery = {
            deleted: false,
            $expr: {
                $in: ["$$ids", "$" + foreignKey.split("_arr")[0]],
            },
            ...queries,
        };
    }

    let pipeline = [];
    let afterMatchPipeline = [];

    if (pipeline_) {
        if (pipeline_.length > 0) {
            for (let i = 0; i < pipeline_.length; i++) {
                if (Object.keys(pipeline_[i])[0].slice(0, 2) !== "$$") {
                    pipeline.push(pipeline_[i]);
                } else {
                    // convert the $$ to $
                    const newPipeline = {};
                    for (let key in pipeline_[i]) {
                        newPipeline[key.slice(1)] = pipeline_[i][key];
                    }
                    afterMatchPipeline.push(newPipeline);
                }
            }
        }
    }

    pipeline.push({
        $match: matchQuery,
    });

    if (afterMatchPipeline.length > 0) {
        pipeline = pipeline.concat(afterMatchPipeline);
    }

    if (project) {
        if (project.length > 0) {
            pipeline.push({
                $project: projectQuery(project),
            });
        }
    }

    return {
        $lookup: {
            from: coll,
            let: {
                ids: "$" + localKey,
            },
            pipeline,
            as,
        },
    };
};

export const projectQuery = project => {
    const projectQuery = {};

    for (let i = 0; i < project.length; i++) {
        const field = project[i];
        if (field[0] === "-") {
            projectQuery[field.substring(1)] = 0;
        } else {
            projectQuery[field] = 1;
        }
    }

    return projectQuery;
};

export const unwind = (path, preserveNullAndEmptyArrays = true) => {
    return {
        $unwind: {
            path: `$${path}`,
            preserveNullAndEmptyArrays,
        },
    };
};

export const project = project => {
    const projectQ = projectQuery(project);
    return {
        $project: projectQ,
    };
};

export const getSearchPipeline = (search, fields) => {
    const pipeline = [];

    if (search === "") return pipeline;

    // split the search query
    const searchList = search.split(" ");

    // remove empty strings
    for (let i = 0; i < searchList.length; i++) {
        if (searchList[i] === "") {
            searchList.splice(i, 1);
        }
    }

    for (let i = 0; i < searchList.length; i++) {
        const innerSearchQueries = [];
        for (let j = 0; j < fields.length; j++) {
            const regex = new RegExp(searchList[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            innerSearchQueries.push({
                [fields[j]]: regex,
            });
        }

        if (innerSearchQueries.length > 0) {
            pipeline.push({
                $match: {
                    $or: innerSearchQueries,
                },
            });
        }
    }

    return pipeline;
};

export const parseQuery = (query, rules = []) => {
    const result = {
        deleted: false,
        ...query,
    };

    if (rules.length > 0) {
        for (const rule of rules) {
            const split = rule.split("-");
            if (split.length > 1) {
                const [r, field] = split;
                if (result[field] === undefined) continue;
                switch (r) {
                    case "id":
                        // check if result[field] is a string
                        if (typeof result[field] === "string") {
                            result[field] = convertToObjectId(result[field]);
                        }
                        break;
                    case "ids":
                        // check if result[field] is an array
                        if (Array.isArray(result[field])) {
                            result[field] = {
                                $in: result[field].map(id => {
                                    if (typeof id === "string") {
                                        return convertToObjectId(id);
                                    }
                                }),
                            };
                        }
                        break;
                    case "r":
                        // check if result[field is an object
                        if (typeof result[field] === "object") {
                            result[field] = {};
                            if (result[field].start !== undefined) {
                                result[field].$gte = result[field].start;
                            }
                            if (result[field].end !== undefined) {
                                result[field].$lte = result[field].end;
                            }
                        }
                }
            }
        }
    }

    return result;
};
