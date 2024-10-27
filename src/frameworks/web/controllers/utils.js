import moment from "moment";

export const getDateRangeByDateBy = dateBy => {
    let startDate = moment();
    let endDate = moment();

    switch (dateBy) {
        case "today":
            startDate.startOf("day");
            endDate.endOf("day");
            break;
        case "yesterday":
            startDate.subtract(1, "days").startOf("day");
            endDate.subtract(1, "days").endOf("day");
            break;
        case "this_week":
            startDate.startOf("week");
            endDate.endOf("week");
            break;
        case "last_week":
            startDate.subtract(1, "weeks").startOf("week");
            endDate.subtract(1, "weeks").endOf("week");
            break;
        case "this_month":
            startDate.startOf("month");
            endDate.endOf("month");
            break;
        case "last_month":
            startDate.subtract(1, "months").startOf("month");
            endDate.subtract(1, "months").endOf("month");
            break;
        case "this_year":
            startDate.startOf("year");
            endDate.endOf("year");
            break;
        case "last_year":
            startDate.subtract(1, "years").startOf("year");
            endDate.subtract(1, "years").endOf("year");
            break;
        default:
            startDate.startOf("day");
            endDate.endOf("day");
            break;
    }

    return [startDate.toDate(), endDate.toDate()];
};

export const getDateRanges = ({ start_date, end_date }) => {
    let startDate = moment();
    let endDate = moment();

    if (start_date) {
        let s = moment(start_date, "DD-MM-YYYY", true);
        if (s.isValid()) {
            startDate = s;
        }
    }

    if (end_date) {
        let e = moment(end_date, "DD-MM-YYYY", true);
        if (e.isValid()) {
            endDate = e;
        }
    }

    return [startDate.toDate(), endDate.toDate()];
};

export const parseQuery = (query, queryFields, sortFields) => {
    const queryObject = {},
        sortObject = {};

    for (const field of queryFields) {
        const split = field.split("-");
        if (split.length < 2) {
            if (query[field]) {
                queryObject[field] = query[field];
            }

            continue;
        }

        let [r, f] = split;
        if (query[f]) {
            switch (r) {
                case "bool":
                    queryObject[f] = query[f].toLowerCase() === "true";
                    break;
                case "number": {
                    // try to split to know if it's going to be a range of numbers
                    const values = query[f].split("/");
                    if (values.length === 1) {
                        if (!isNaN(query[f])) {
                            queryObject[f] = Number(query[f]);
                        }
                    }
                    if (values.length === 2) {
                        let [start, end] = values;
                        queryObject[f] = {};
                        if (!isNaN(start)) {
                            queryObject[f].start = Number(start);
                        }

                        if (!isNaN(end)) {
                            queryObject[f].end = Number(end);
                        }
                    }
                    break;
                }
                case "date": {
                    // try to split if it's going to be a range of date
                    const values = query[f].split("/");
                    if (values.length === 1) {
                        const d = moment(query[f], "DD-MM-YYYY", true);
                        if (d.isValid()) {
                            queryObject[f] = d.toDate();
                        }
                    }

                    if (values.length === 2) {
                        queryObject[f] = {};
                        [queryObject[f].start, queryObject[f].end] = getDateRanges({
                            start_date: values[0],
                            end_date: values[1],
                        });
                    }
                }
            }
        }
    }

    // check if there is a date by
    if (query["date_by"]) {
        let [startDate, endDate] = getDateRangeByDateBy(query["date_by"]);
        queryObject["createdAt"] = {
            start: startDate,
            end: endDate,
        };
    }

    // get sort query
    for (const field of sortFields) {
        if (query[`sort_${field}`]) {
            sortObject[field] = query[`sort_${field}`] === "asc" ? 1 : -1;
        }
    }

    return [queryObject, sortObject];
};
