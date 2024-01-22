import { injectable } from "inversify";
import { ApiError } from "./api-error";
import { IFetchApiService } from "./fetch-api-service.interface";
import { IApiError } from "./api-error.interface";

const API_URL = 'https://localhost:4000/'

type RequestMehtod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type TRequestOptions<TMethod extends RequestMehtod> = Omit<RequestInit, 'method'> & {method: TMethod}

@injectable()
export class FetchApiService implements IFetchApiService{

    private createRequestOptions<TRequestMethod extends RequestMehtod>(
        method: TRequestMethod, 
        requestOptions?: Omit<TRequestOptions<TRequestMethod>, 'method'>
    ) {
        return Object.assign({}, requestOptions ?? {}, {method});
    }

    private async parseResponse<TResData>(response: Response) {
        switch(response.headers.get('Content-Type')) {
            case 'application/json':
                return response.json() as TResData;
            case 'text/plain':
            default:
                return response.text() as TResData;
        }
    }

    private async handleRequest<TResData, TMethod extends RequestMehtod>(path: string, requestOptions?: TRequestOptions<TMethod>) {
        const res = await fetch(`${API_URL}${path}`, requestOptions);
        if (res.ok) {
            return [undefined, await this.parseResponse<TResData>(res)] satisfies [undefined, TResData];
        }
        return [new ApiError(res.status, res.statusText), undefined] satisfies [IApiError, undefined];
    }

    async get<TResData>(path: string, requestOptions?: TRequestOptions<'GET'>) {
        return this.handleRequest<TResData, 'GET'>(path, this.createRequestOptions('GET', requestOptions))
    }

    async post<TResData>(path:string, requestOptions?: TRequestOptions<'POST'>) {
        return this.handleRequest<TResData, 'POST'>(path, this.createRequestOptions('POST', requestOptions))
    }

    async put<TResData>(path: string, requestOptions?: TRequestOptions<'PUT'>) {
        return this.handleRequest<TResData, 'PUT'>(path, this.createRequestOptions('PUT', requestOptions))
    }

    async delete<TResData>(path: string, requestOptions?: TRequestOptions<'DELETE'>) {
        return this.handleRequest<TResData, 'DELETE'>(path, this.createRequestOptions('DELETE', requestOptions))
    }
}