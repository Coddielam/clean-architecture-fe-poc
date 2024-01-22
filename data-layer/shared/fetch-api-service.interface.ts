import { IApiError } from "./api-error.interface";

type RequestMehtod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type TRequestInit<TMethod extends RequestMehtod> = Omit<RequestInit, 'method'> & {method: TMethod}

export type TRequestOptions<TMethod extends RequestMehtod> = Omit<TRequestInit<TMethod>, 'method'>;

type ApiResult<TResData> = Promise<[IApiError, undefined] | [undefined, TResData]>

export interface IFetchApiService {
    get<TResData>(path: string, requestOptions?: TRequestOptions<'GET'>): ApiResult<TResData>;   

    post<TResData>(path: string, requestOptions?: TRequestOptions<'POST'>): ApiResult<TResData>;   

    put<TResData>(path: string, requestOptions?: TRequestOptions<'PUT'>): ApiResult<TResData>;

    delete<TResData>(path: string, requestOptions?: TRequestOptions<'DELETE'>): ApiResult<TResData>;   
}