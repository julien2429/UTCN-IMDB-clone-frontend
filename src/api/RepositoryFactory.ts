import { GenreRepository } from "./Repositories/genreRepository";
import { MovieRepository } from "./Repositories/movieRepository";
import { PersonRepository } from "./Repositories/personRepository";
import { S3Repository } from "./Repositories/S3Repository";
import { UserRepository } from "./Repositories/usersRepository";


const repositories: { 
    user: typeof UserRepository, 
    s3: typeof S3Repository, 
    genre: typeof GenreRepository, 
    movie: typeof MovieRepository, 
    person: typeof PersonRepository,

} = {
    user: UserRepository, 
    s3: S3Repository,
    genre: GenreRepository,
    movie: MovieRepository,
    person: PersonRepository,

};

type RepositoryKeys = keyof typeof repositories;
type RepositoryType = typeof repositories[RepositoryKeys];

const RepositoryFactory = {
    get: (name: RepositoryKeys): RepositoryType => {
        const repository = repositories[name];
        if (!repository) {
            throw new Error(`Repository ${name} not found`);
        }
        return repository;
    }
};

export default RepositoryFactory;