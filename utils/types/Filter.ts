import type { Preference } from "./preference";


/**
 * its a function instead of const so it
 * creatse new object every time it is used
 */
export function defaultFilter(): Filter{ 
    return {
        liked: true,
        neutral: true,
        disliked: true,
    }
}

export type Filter = {
    liked: boolean;
    neutral: boolean;
    disliked: boolean;
}

export type PageFilter = {
    page: number;
}

export type FilterWithPage = Filter & PageFilter

export function defaultFilterWithPage(): FilterWithPage {
    return {
        ...defaultFilter(),
        page: 0
    }
}

export type ProductFilters = PageFilter & {
    productFilter: Filter
    categoryFilter: Filter
}

export function defaultProductFilters(): ProductFilters {
    return {
        productFilter: defaultFilter(),
        categoryFilter: defaultFilter(),
        page: 0
    }
}