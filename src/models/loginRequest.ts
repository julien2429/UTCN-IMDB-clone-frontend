export interface LoginRequest {
    username: string;
    password: string;
}

export function createDefaultLoginRequest(): LoginRequest {
    return {
        username: "",
        password: ""
    };
}