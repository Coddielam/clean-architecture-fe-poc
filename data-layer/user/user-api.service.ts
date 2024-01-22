import { inject, injectable } from "inversify";
import { ApiServiceResult, IUserApiService } from "./user-api.service.interface";
import { User } from "domain-layer/user/user.types";
import type { IFetchApiService } from "@data-layer/shared/fetch-api-service.interface";
import { BINDINGS } from '../../di-container.ts';
import { UserModel } from "./user-api.types.ts";
import { IApiError } from "@data-layer/shared/api-error.interface.ts";
import { ApiError } from "@data-layer/shared/api-error.ts";

const basePath = 'user/';
@injectable()
export class UserApiService implements IUserApiService {
    constructor(
        @inject(BINDINGS.FetchApiService) private fetchApiService: IFetchApiService
    ) {}

    private async mapUserFriends(userModel: UserModel): Promise<[IApiError, undefined] | [undefined, User]> {
        const [error, users] = await this.getUserFriends(userModel.id);
        if (error) {
            return [error, undefined];
        }
        return [undefined, { ...userModel, friends: users} as User]
    }

    async registerUser(userProfile: Omit<User, "id">): ApiServiceResult<User> {
        const [apiError, responseData] = await this.fetchApiService.post<UserModel>(basePath, { body: JSON.stringify(userProfile) });
        if (apiError) {
            return [apiError, undefined];
        }
        const [mapUserFriendsError, user] = await this.mapUserFriends(responseData);
        if (mapUserFriendsError) {
            return [mapUserFriendsError, undefined];
        }
        return [undefined, user];
    }

    async getUsers(): ApiServiceResult<User[]> {
        const [apiError, responseData] = await this.fetchApiService.get<UserModel[]>(`${basePath}`);
        if (apiError) {
            return [apiError, undefined];
        }
        try {
            const users = await Promise.all(responseData.map(async (userModel) => {
                const [apiError, user] = await this.mapUserFriends(userModel);
                if (apiError) {
                    throw apiError;
                }
                return user;
            }));

            return [undefined, users];
        } catch (apiError) {
            return [apiError as ApiError, undefined]
        }
    }

    async getUserProfile(userId: string): ApiServiceResult<User> {
        const [apiError, responseData] = await this.fetchApiService.post<User>(`${basePath}${userId}`);
        if (apiError) {
            return [apiError, undefined]
        }
        return [undefined, responseData];
    }

    async getUserFriends(userId: string): ApiServiceResult<User[]> {
        const [apiError, responseData] = await this.fetchApiService.post<User[]>(`${basePath}${userId}`);
        if (apiError) {
            return [apiError, undefined]
        }
        return [undefined, responseData];
    }

    async addUserAsFriend(userId: string, requestFriendId: string): ApiServiceResult<void> {
        const [apiError] = await this.fetchApiService.post<void>(`${basePath}${userId}`, { body: JSON.stringify({ requestFriendId }) });
        if (apiError) {
            return [apiError, undefined]
        }
        return [undefined, undefined];
    }
    
}