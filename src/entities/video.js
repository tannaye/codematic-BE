export default class Video {
    constructor({}) {}

    static getDetailsRules() {
        return {
            videoId: "required|string",
        };
    }

    static getCommentsRules() {
        return {
            videoId: "required|string",
            nextPageToken: "string",
        };
    }
}
