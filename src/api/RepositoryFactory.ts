import usersRepository from "./Repositories/usersRepository";

const repositories = {
    user: usersRepository,

}

const RepositoryFactory = {
    get: (name: keyof typeof repositories) => repositories[name]
};

export default RepositoryFactory;