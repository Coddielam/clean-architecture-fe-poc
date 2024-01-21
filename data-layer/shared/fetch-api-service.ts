import { injectable } from "inversify";
import { ApiError } from "./api-error";
import { IFetchApiService } from "./fetch-api-service.interface";

const API_URL = 'https://localhost:4000/'

type RequestMehtod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type TRequestOptions<TMethod extends RequestMehtod> = Omit<RequestInit, 'method'> & {method: TMethod}

@injectable()
export class FetchApiService implements IFetchApiService{

    private createRequestOptions<TRequestMethod extends RequestMehtod>(method: TRequestMethod, requestOptions?: Omit<TRequestOptions<TRequestMethod>, 'method'>) {
        return Object.assign({}, requestOptions ?? {}, {method});
    }

    private async handleRequest<TMethod extends RequestMehtod>(path: string, requestOptions?: TRequestOptions<TMethod>) {
        const res = await fetch(`${API_URL}${path}`, requestOptions);
        const responseError = res.ok ? undefined : new ApiError(res.status, res.statusText);

        // eliminate try-catching multiple errors !!
        // you must destruct out the error and response --> [apiError, response]
        return [responseError, res] satisfies [ApiError | undefined, Response]
    }

    async get(path: string, requestOptions?: TRequestOptions<'GET'>) {
        return this.handleRequest(path, this.createRequestOptions('GET', requestOptions))
    }

    async post(path:string, requestOptions?: TRequestOptions<'POST'>) {
        return this.handleRequest(path, this.createRequestOptions('POST', requestOptions))
    }

    async put(path: string, requestOptions?: TRequestOptions<'PUT'>) {
        return this.handleRequest(path, this.createRequestOptions('PUT', requestOptions))
    }

    async delete(path: string, requestOptions?: TRequestOptions<'DELETE'>) {
        return this.handleRequest(path, this.createRequestOptions('DELETE', requestOptions))
    }
}