export function defaultFilter(): Filter {
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

export type TypedFilter = {
    type: FilterType
} & Filter

export enum FilterType{
    Product,
    Category,
    ProductByCategory
}