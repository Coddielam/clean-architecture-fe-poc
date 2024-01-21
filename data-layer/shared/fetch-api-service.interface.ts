import { ApiError } from "./api-error";

type RequestMehtod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type TRequestInit<TMethod extends RequestMehtod> = Omit<RequestInit, 'method'> & {method: TMethod}

export type TRequestOptions<TMethod extends RequestMehtod> = Omit<TRequestInit<TMethod>, 'method'>;

type ApiResult = Promise<[ ApiError | undefined, Response ]>

export interface IFetchApiService {
    get(path: string, requestOptions?: TRequestOptions<'GET'>): ApiResult;   

    post(path: string, requestOptions?: TRequestOptions<'POST'>): ApiResult;   

    put(path: string, requestOptions?: TRequestOptions<'PUT'>): ApiResult;

    delete(path: string, requestOptions?: TRequestOptions<'DELETE'>): ApiResult;   
}