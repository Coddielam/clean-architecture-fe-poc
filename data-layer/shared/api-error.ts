import { IApiError } from "./api-error.interface";

export class ApiError extends Error implements IApiError {

    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;        
    }
}