import type { Person } from "@/models/person";
import { myApi } from "../apiBase";

const url = '/person';
export const PersonRepository = {

    get() {
        return myApi.get<Person[]>(url);
    },

    getPerson(personId: string) {
        return myApi.get<Person>(`${url}/${personId}`);
    },

    post(person: Person) {
        return myApi.post<Person>(url, person);
    },

    put(person: Person) {
        return myApi.put<Person>(`${url}/${person.personId}`, person);
    },

    delete(personId: string) {
        return myApi.delete<Person>(`${url}/${personId}`);
    },

}
