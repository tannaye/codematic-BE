export function flattenObjectKeys(obj, parentKey = "") {
    let result = [];

    for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            const fullPath = parentKey ? `${parentKey}.${key}` : key;

            if (typeof obj[key] === "object" && obj[key] !== null) {
                result = result.concat(flattenObjectKeys(obj[key], fullPath));
            } else {
                result.push(fullPath);
            }
        }
    }

    return result;
}

export function setObjectValueByFlattenedKey(obj, flattenedKey, newValue) {
    const keys = flattenedKey.split(".");
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // eslint-disable-next-line no-prototype-builtins
        if (!current.hasOwnProperty(key)) {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = newValue;
}
