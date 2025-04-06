import type { MovieCast } from "./MovieCast";

export interface Person{

    personId: string;
    firstName: string;
    lastName: string;
    gender: string;
    nationality?: string;
    birthDate?: Date | null;
    deathDate?: Date | null;
    movieCastList: MovieCast[];
}

export function createDefaultPerson(): Person{
    return {
        personId: '',
        firstName: '',
        lastName: '',
        gender: '',
        nationality: undefined,
        birthDate: null,
        deathDate: null,
        movieCastList: []
    };
}
