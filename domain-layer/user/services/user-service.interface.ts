import { DomainError } from "domain-layer/shared/domain-error";
import type { User } from "../user.types"

export type TDomainServiceResult<TResult, TError extends DomainError | undefined = DomainError> =  Promise<[TError, undefined] | [undefined, TResult]>;

export interface IUserService {
    /**
     * Register a user with name, email, phone, profile picture and company
     * */ 
    registerUser(userProfile: Omit<User, 'id'>): TDomainServiceResult<User>;

    /**
     * Get the user profile given the user id
     * */ 
    getUserProfile(userId: string): TDomainServiceResult<User>;

    /**
     * Add user as friend
     * */
    addUserAsFriend(userId: string, requestFriendId: string): TDomainServiceResult<void>;

    /**
     * Get a user's friends
     * */ 
    getUserFriends(userId: string): TDomainServiceResult<User[]>;
}