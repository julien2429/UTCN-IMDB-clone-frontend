export interface ReviewRequest {
    "reviewText": string;
    "rating": number;
    "movieId": string | null;
    "username": string | null;
}