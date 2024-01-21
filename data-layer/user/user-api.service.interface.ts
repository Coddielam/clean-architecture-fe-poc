import { IApiError } from "@data-layer/shared/api-error.interface";
import { User } from "domain-layer/user/user.types";

export type ApiServiceResult<TResData> = Promise<[IApiError | SyntaxError, undefined] | [undefined, TResData]>

export interface IUserApiService {
    registerUser(userProfile: Omit<User, 'id'>): ApiServiceResult<User>;

    getUsers(): ApiServiceResult<User[]>;

    getUserProfile(userId: string): ApiServiceResult<User>;

    getUserFriends(userId: string): ApiServiceResult<User[]>;

    addUserAsFriend(userId: string, requestFriendId: string): ApiServiceResult<void>;
}