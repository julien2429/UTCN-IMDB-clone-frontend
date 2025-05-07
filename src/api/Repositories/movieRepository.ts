import type { Movie } from "@/models/movie";
import { myApi } from "../apiBase";
import type { MovieDetails } from "@/models/movieDetails";
import type { MovieFilters } from "@/models/movieFilters";

const url = '/movie';
export const MovieRepository = {

    get() {
        return myApi.get<Movie[]>(url);
    },

    getMovie(movieId: string) {
        return myApi.get<Movie>(`${url}/${movieId}`);
    },

    getMovieDetails(movieId: string) {
        return myApi.get<MovieDetails>(`${url}/details/${movieId}`);
    },

    post(movie: Movie) {
        return myApi.post<Movie>(url, movie);
    },

    put(movie: Movie) {
        return myApi.post<Movie>(`${url}/${movie.movieId}`, movie);
    },

    addGerneToMovie(movie: Movie, genreIds: string[]) {
        return myApi.put<Movie>(`${url}/addGenre/${movie.movieId}`, genreIds);
    },

    delete(movieId: string) {
        return myApi.delete<Movie>(`${url}/${movieId}`);
    },

    getMoviesByFilters(filters: MovieFilters) {
        return myApi.post<Movie[]>(`${url}/filterMovies`, filters);
    }


}
