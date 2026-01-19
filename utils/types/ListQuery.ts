export type ListQuery = {
    counter: number,
    page: number,
    fetched: boolean
} &
    PreferenceFilter;

export function defaultListQuery(): ListQuery {
    return {
        liked: true,
        neutral: true,
        disliked: true,
        counter: 0,
        page: 0,
        fetched: false
    }
}

export type PreferenceFilter = {
    liked: boolean;
    neutral: boolean;
    disliked: boolean;
}

export type TypedFilter = {
    type: FilterType
} & PreferenceFilter

export enum FilterType{
    Product,
    Category
}