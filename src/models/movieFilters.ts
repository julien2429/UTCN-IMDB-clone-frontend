export interface MovieFilters {
    title?: string | null; // Optional field
    genresNames?: string[] | null; // Optional array of strings
    director?: string | null; // Optional field
    startDate?: Date | null; // Optional field
    endDate?: Date | null; // Optional field
}