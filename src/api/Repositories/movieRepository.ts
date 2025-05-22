import type { Movie } from "@/models/movie";
import { myApi } from "../apiBase";
import type { MovieDetails } from "@/models/movieDetails";
import type { MovieFilters } from "@/models/movieFilters";
import type { Review } from "@/models/review";
import type { MovieCastResponse } from "@/models/MovieCastResponse";

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
    },

    approveReview(reviewUUID: string) {
        return myApi.post<Review>(`${url}/approveReview/${reviewUUID}`);
    },

    rejectReview(reviewUUID: string) {
        return myApi.post<Review>(`${url}/rejectReview/${reviewUUID}`);
    },

    setToPending(reviewUUID: string) {
        return myApi.post<Review>(`${url}/setToPending/${reviewUUID}`);
    },

    getAllPendingReviews() {
        return myApi.get<Review[]>(`${url}/getAllPendingReviews`);
    },

    getAllApprovedReviews() {
        return myApi.get<Review[]>(`${url}/getAllApprovedReviews`);
    },

    getAllRejectedReviews() {
        return myApi.get<Review[]>(`${url}/getAllRejectedReviews`);
    },

    addRoleToMovie(movieUUID: string, personUUID: string, roleTitle: string) {
        return myApi.put<Movie>(`${url}/addRole/${movieUUID}/${personUUID}/${roleTitle}`);
    },

    getRoles(movieUUID: string) {
        return myApi.get<MovieCastResponse[]>(`${url}/getRoles/${movieUUID}`);
    },

    removeRoleFromMovie(movieCastUUID: string) {
        return myApi.post<void>(`${url}/removeRole/${movieCastUUID}`);
    },

    editRoleInMovie(movieCastUUID: string, roleTitle: string) {
        return myApi.post<MovieCastResponse>(`${url}/editRole/${movieCastUUID}/${roleTitle}`);
    },
}
