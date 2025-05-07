import type { UserRole } from "@/enums/UserRole";

export interface LoginResponse {
    success: boolean;
    errorMessage: string;
    token: string;
}