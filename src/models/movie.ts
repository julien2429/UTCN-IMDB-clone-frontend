import type { Genre } from "./genre";
import type { MovieCast } from "./MovieCast";


export interface Movie {
    movieId: number;
    title: string;
    year: string;
    genres: Genre[];
    movieCastList: MovieCast[];
}