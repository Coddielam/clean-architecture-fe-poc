import { inject, injectable } from "inversify";
import { ApiServiceResult, IUserApiService } from "./user-api.service.interface";
import { User } from "domain-layer/user/user.types";
import type { IFetchApiService } from "@data-layer/shared/fetch-api-service.interface";
import { BINDINGS } from '../../di-container.ts';

const basePath = 'user/';
@injectable()
export class UserApiService implements IUserApiService {
    constructor(
        @inject(BINDINGS.FetchApiService) private fetchApiService: IFetchApiService
    ) {}

    async registerUser(userProfile: Omit<User, "id">): ApiServiceResult<User> {
        const [apiError, response ] = await this.fetchApiService.post(basePath, { body: JSON.stringify(userProfile) });
        if (apiError) {
            return [apiError, undefined]
        }
        try {
            return [undefined, await response.json() as User];
        } catch (error) {
            return [error as SyntaxError, undefined];
        }
    }

    async getUsers(): ApiServiceResult<User[]> {
        const [apiError, response] = await this.fetchApiService.get(`${basePath}`);
        if (apiError) {
            return [apiError, undefined];
        }
        try {
            return [undefined, await response.json() as User[]];
        } catch (error) {
            return [error as SyntaxError, undefined];
        }
    }

    async getUserProfile(userId: string): ApiServiceResult<User> {
        const [apiError, response ] = await this.fetchApiService.post(`${basePath}${userId}`);
        if (apiError) {
            return [apiError, undefined]
        }
        try {
            return [undefined, await response.json() as User];
        } catch (error) {
            return [error as SyntaxError, undefined];
        }
    }

    async getUserFriends(userId: string): ApiServiceResult<User[]> {
        const [apiError, response] = await this.fetchApiService.post(`${basePath}${userId}`);
        if (apiError) {
            return [apiError, undefined]
        }
        try {
            return [undefined, await response.json() as User[]];
        } catch (error) {
            return [error as SyntaxError, undefined];
        }
    }

    async addUserAsFriend(userId: string, requestFriendId: string): ApiServiceResult<void> {
        const [apiError] = await this.fetchApiService.post(`${basePath}${userId}`, { body: JSON.stringify({ requestFriendId }) });
        if (apiError) {
            return [apiError, undefined]
        }
        try {
            return [undefined, undefined];
        } catch (error) {
            return [error as SyntaxError, undefined];
        }
    }
    
}