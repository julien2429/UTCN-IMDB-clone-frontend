import type { Movie } from "./movie";

export interface ListResponseDTO {
    listId: string;
    listName: string;
    movieList: Movie[];
}


