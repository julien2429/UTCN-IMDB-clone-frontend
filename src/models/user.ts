import { UserRole } from "@/enums/UserRole";

export interface User {
    userId: string;
    username: string;
    password: string;
    email: string;
    role: UserRole;
} 

export function createDefaultUser(): User {
    return {
        userId: "",
        username: "",
        password: "",
        email: "",
        role: UserRole.UNKNOWN
    };
}