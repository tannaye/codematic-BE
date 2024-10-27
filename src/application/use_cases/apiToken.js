import rand_token from "rand-token";

export default class APITokenUseCase {
    constructor({ logger, apiTokenCache }) {
        this.logger = logger;
        this.apiTokenCache = apiTokenCache;
    }

    async createToken(data) {
        const token = rand_token.uid(64);
        await this.apiTokenCache.setToken({ token, data });
        return token;
    }

    async validateToken(token) {
        return await this.apiTokenCache.getToken(token);
    }

    async expireToken(token) {
        return await this.apiTokenCache.deleteToken(token);
    }
}
