import { UnauthorizedError, BadRequestError } from "../../entities/error.js";
import axios from "axios";

export default class VideoUseCase {
    constructor({ logger, videoValidator }) {
        this.videoValidator = videoValidator;
        this.logger = logger;
    }

    async getVideo(videoId) {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${process.env.YOUTUBE_API_KEY}`;

        const response = await axios.get(url);
        if (!response) {
            throw new BadRequestError("Video not found");
        }
        const videoData = response.data.items[0];

        return {
            thumbnail: videoData.snippet.thumbnails.maxres.url,
            title: videoData.snippet.title,
            description: videoData.snippet.description,
            viewCount: videoData.statistics.viewCount,
            likeCount: videoData.statistics.likeCount,
        };
    }

    async getComments(query) {
        console.log("here");
        let { videoId, nextPageToken } = query;
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoId}&part=snippet&key=${process.env.YOUTUBE_API_KEY}&maxResults=100`;

        console.log(videoId, nextPageToken);

        let comments = [];
        nextPageToken = nextPageToken || "";

        // do {
        const response = await axios.get(url + (nextPageToken ? `&pageToken=${nextPageToken}` : ""));
        const data = response.data;
        nextPageToken = data.nextPageToken || null;

        console.log(data);

        const newComments = data.items.map(item => ({
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            comment: item.snippet.topLevelComment.snippet.textDisplay,
        }));

        comments = [...comments, ...newComments];
        // } while (nextPageToken);

        return {
            comments,
            nextPageToken,
        };
    }

    async;
}
