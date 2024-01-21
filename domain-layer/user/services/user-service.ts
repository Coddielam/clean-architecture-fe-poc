import { inject, injectable } from "inversify";
import { IUserService, TDomainServiceResult } from "./user-service.interface";
import { User } from "../user.types";
import { BINDINGS } from "di-container";
import type { IUserApiService } from "@data-layer/user/user-api.service.interface";
import { DomainError, DomainErrorType } from "domain-layer/shared/domain-error";
import { ApiError } from "@data-layer/shared/api-error";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(BINDINGS.UserService) private userApiService: IUserApiService
    ) {}

    private mapToDomainError(error: SyntaxError | ApiError) {
        return new DomainError(
            error.message, 
            error instanceof ApiError ? DomainErrorType.API_ERROR : DomainErrorType.APP_ERROR
        );
    }

    async registerUser(userProfile: Omit<User, "id">): TDomainServiceResult<User> {
        const [error, user] = await this.userApiService.registerUser(userProfile);
        if (error) { return[this.mapToDomainError(error), undefined]; };

        return [undefined, user];
    }

    async getUserProfile(userId: string): TDomainServiceResult<User> {
        const [error, user] = await this.userApiService.getUserProfile(userId);
        if (error) { return[this.mapToDomainError(error), undefined]; };

        return [undefined, user];
    }

    async addUserAsFriend(userId: string, requestFriendId: string): TDomainServiceResult<void>{
        const [error] = await this.userApiService.addUserAsFriend(userId, requestFriendId);
        if (error) { return[this.mapToDomainError(error), undefined]; };

        return [undefined, undefined]
    }

    async getUserFriends(userId: string): TDomainServiceResult<User[]>{
        const [error, friends] = await this.userApiService.getUserFriends(userId);
        if (error) { return[this.mapToDomainError(error), undefined]; };

        return [undefined, friends];
    }
}