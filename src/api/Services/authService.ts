import type { LoginRequest } from '../../models/loginRequest';
import type { User } from "@/models/user";
import { myApi } from "../apiBase";
import { AuthRepository } from "../Repositories/authRepository";


export const AuthService = {

    login: (loginRequest: LoginRequest) => {
        return AuthRepository.login(loginRequest);
    },

    register: (user: User) => {
        return AuthRepository.register(user);
    },

    forgotPasswordSendEmail: (email: String) => {
        return AuthRepository.forgotPasswordSendEmail(email)
    },

    resetPassword: (password: String, token: String, email: String) => {
        return AuthRepository.resetPassword(password, token, email)
    },


    

};
