import type { User } from "@/models/user";
import { myApi } from "../apiBase";
import type { Genre } from "@/models/genre";



const url = '/genre';
export const GenreRepository = {

    get() {
        return myApi.get<Genre[]>(url);
    },

    getGenre(genreId: string) {
        return myApi.get<Genre>(`${url}/${genreId}`);
    },

    post(genre: Genre) {
        return myApi.post<Genre>(url, genre);
    },

    put(genre: Genre) {
        return myApi.put<Genre>(`${url}/${genre.genreId}`, genre);
    },

    delete(genreId: string) {
        return myApi.delete<Genre>(`${url}/${genreId}`);
    },



}
