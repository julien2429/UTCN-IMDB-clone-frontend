import type { Movie } from "./movie";




export interface Genre {

    genreId: number;
    name: string;
    movies: Movie[];

}