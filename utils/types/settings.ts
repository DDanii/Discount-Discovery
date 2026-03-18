import { defaultFilter, type Filter } from "./Filter"

export type Settings = {
    productFilters: Filter,
    categoryFilters: Filter,
    shopSettings: {
        shopId: string,
        enabled: boolean
    }[],
    productByCategoryFilters: Filter
}

/**
 * its a function instead of const so it
 * creatse new object every time it is used
 */
export function defaultSettings(): Settings {
    return {
        productFilters: defaultFilter(),
        categoryFilters: defaultFilter(),
        productByCategoryFilters: defaultFilter(),
        shopSettings: []
    }
}