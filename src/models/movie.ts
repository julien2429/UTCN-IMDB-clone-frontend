import type { Genre } from "./genre";
import type { MovieCast } from "./MovieCast";


export interface Movie {
    movieId: string;
    title: string;
    year?: Date | null; 
    description?: string;
    genres: Genre[];
    movieCastList: MovieCast[];
    imageUrl?: string;
}

export function createDefaultMovie(): Movie {
    return {
        movieId: "",
        title: "",
        year: null,
        genres: [],
        movieCastList: []
    };
}