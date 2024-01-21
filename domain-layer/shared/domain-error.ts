export const DomainErrorType = {
    APP_ERROR: 'APP_ERROR',
    API_ERROR: 'API_ERROR'
} as const;

export type DomainErrorType = (typeof DomainErrorType)[keyof typeof DomainErrorType]

export class DomainError extends Error {

    type: DomainErrorType

    constructor(message: string, type: DomainErrorType) {
        super(message);

        this.type = type;
    }
}