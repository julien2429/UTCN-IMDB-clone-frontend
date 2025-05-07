import type { ReviewRequest } from "@/models/reviewRequest";
import { UserRepository } from "../Repositories/usersRepository";

export const UserService = {

    addAReview: (reviewRequest: ReviewRequest) => {
        return UserRepository.AddAReview(reviewRequest);
    },
    
};