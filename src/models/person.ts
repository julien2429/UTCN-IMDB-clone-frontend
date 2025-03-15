import type { MovieCast } from "./MovieCast";

export interface Person{

    personId: number;
    firstName: string;
    lastName: string;
    gender: string;
    nationality?: string;
    birthDate: string;
    deathDate: string;

    movieCastList: MovieCast[];


}