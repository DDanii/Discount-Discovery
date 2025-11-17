export type listQuery = {
    counter: number,
    page: number
} &
    preferenceFilter;

export const defaultListQuery = {
    liked: true,
    neutral: true,
    disliked: true,
    counter: 0,
    page: 0
}

export interface preferenceFilter {
    liked: boolean;
    neutral: boolean;
    disliked: boolean;
}