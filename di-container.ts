import { Container } from 'inversify'
import { IFetchApiService } from './data-layer/shared/fetch-api-service.interface';
import { FetchApiService } from './data-layer/shared/fetch-api-service';
import { IUserApiService } from './data-layer/user/user-api.service.interface';
import { UserApiService } from './data-layer/user/user-api.service';
import { IUserService } from 'domain-layer/user/services/user-service.interface';
import { UserService } from 'domain-layer/user/services/user-service';

export const BINDINGS = {
    FetchApiService: Symbol.for('FetchApiService'),
    // data layer
    UserApiService: Symbol.for('UserService'),
    // domain layer
    UserService: Symbol.for('UserService')
}

const container = new Container();

container.bind<IFetchApiService>(BINDINGS.FetchApiService).to(FetchApiService).inSingletonScope();
// api services
container.bind<IUserApiService>(BINDINGS.UserApiService).to(UserApiService).inSingletonScope();
// domain services
container.bind<IUserService>(BINDINGS.UserService).to(UserService).inSingletonScope();

export { container };