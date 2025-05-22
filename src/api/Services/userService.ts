import type { ReviewRequest } from "@/models/reviewRequest";
import { UserRepository } from "../Repositories/usersRepository";

export const UserService = {

    addAReview: (reviewRequest: ReviewRequest) => {
        return UserRepository.AddAReview(reviewRequest);
    },

    fetchUserLists: (userId: string) => {
        return UserRepository.fetchUserLists(userId);
    },

    fetchList: (userId: string, listId: string) => {
        return UserRepository.fetchList(userId, listId);
    },

    addToList: (userId: string, listId: string, movieId: string) => {
        return UserRepository.addToList(userId, listId, movieId);
    },

    removeFromList: (userId: string, listId: string, movieId: string) => {
        return UserRepository.removeFromList(userId, listId, movieId);
    },

    findMovieInLists: (userId: string, movieId: string) => {
        return UserRepository.findMovieInLists(userId, movieId);
    }

};