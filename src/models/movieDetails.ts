import type { Genre } from "./genre";
import type { MovieCast } from "./MovieCast";
import type { Person } from "./person";
import type { Review } from "./review";
import type { Role } from "./role";

export interface ActorRoles {
    actor: Person;
    roles: Role[];
}

export interface MovieDetails {
    movieId: string;
    title: string;
    year?: Date | null; 
    description?: string;
    genres: Genre[];
    userReviews?: Review[];
    criticReviews?: Review[];

    averageUserRating?: number;
    averageCriticRating?: number;
    averageRating?: number;
    meanUserRating?: number;
    meanCriticRating?: number;
    meanRating?: number;


    director?: string;
    imageUrl?: string;
    actorsAndRoles?: ActorRoles[];

}

export function createDefaultMovieDetails(): MovieDetails {
    return {
        movieId: "",
        title: "",
        year: null,
        description: "",
        genres: [],
        director: "",
        imageUrl: "",
        actorsAndRoles: [],
        userReviews: [],
        criticReviews: [],
        averageUserRating: 0,
        averageCriticRating: 0,
        averageRating: 0,
        meanUserRating: 0,
        meanCriticRating: 0,
        meanRating: 0
    };
}

