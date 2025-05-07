
import { AuthService } from './Services/authService';
import { UserService } from './Services/userService';

const services: { 
    auth: typeof AuthService,
    user: typeof UserService
} = {
    auth: AuthService,
    user: UserService
};

type RepositoryKeys = keyof typeof services;
type RepositoryType = typeof services[RepositoryKeys];

const ServicesFactory = {
    get: (name: RepositoryKeys): RepositoryType => {
        const repository = services[name];
        if (!repository) {
            throw new Error(`Repository ${name} not found`);
        }
        return repository;
    }
};

export default ServicesFactory;