import type { Movie } from "./movie";




export interface Genre {

    genreId: string;
    title: string;
    movies: Movie[];

}

export function createDefaultGenre(): Genre {
    return {
        genreId: "",
        title: "",
        movies: []
    };
}