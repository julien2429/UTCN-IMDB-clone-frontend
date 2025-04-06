import type { UserRole } from "@/enums/UserRole";

export interface LoginResponse {
    success: boolean;
    role: UserRole;
    errorMessage: string;
    token: string;
}