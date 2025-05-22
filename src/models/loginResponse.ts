import type { UserRole } from "@/enums/UserRole";

export interface LoginResponse {
    userId: string;
    success: boolean;
    errorMessage: string;
    token: string;
}