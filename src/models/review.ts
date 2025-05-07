import type { Genre } from "./genre";
import type { MovieCast } from "./MovieCast";


export interface Review {
    reviewId: string;
    rating: number;
    comment?: string | null;
}

export function createDefaultReview(): Review {
    return {
        reviewId: "",
        rating: 0,
        comment: ""
    };
}