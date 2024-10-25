import { Container } from 'inversify';
import TYPES from './ioc.types';

import '../controllers/_controllers';
import AuthProvider from '../providers/auth.provider';
import registerRepositories from '../repositories/_register.repositories';
import registerServices from '../services/_register.services';

// Load everything needed to the Container
const container = new Container();

// Config
container.bind<AuthProvider>(TYPES.AuthProvider).to(AuthProvider);

// Repositories
registerRepositories(container);

// Services
registerServices(container);

export default container;
