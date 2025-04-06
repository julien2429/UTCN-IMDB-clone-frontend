import type { MovieCast } from "./MovieCast";


export interface Role {
    roleId: number;
    roleName: string;
    movieCastsList: MovieCast[];
}