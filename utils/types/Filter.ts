import { getDocs, ShopDB } from "~/database/database"

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
    liked: boolean
    neutral: boolean
    disliked: boolean
}

export type PageFilter = {
    page: number
}

export type ShopFilter = {
    shopId: string
    enabled: boolean
}

export async function defaultShopsFilter(): Promise<ShopFilter[]> {
    const db = new ShopDB()
    const shops = await db.allDocs({include_docs: true})
    const shopFilters = [] as ShopFilter[]
    for (const shop of getDocs(shops)){
        shopFilters.push({shopId: shop._id, enabled: true})
    }
    return shopFilters
}

export type FilterWithPage = Filter & PageFilter

export function defaultFilterWithPage(): FilterWithPage {
    return {
        ...defaultFilter(),
        page: 0
    }
}

export type ProductFilters = PageFilter & {
    name: string
    shops: ShopFilter[]
    productFilter: Filter
    categoryFilter: Filter
}

export async function defaultProductFilters(): Promise<ProductFilters> {
    return {
        name: "",
        shops: await defaultShopsFilter(),
        productFilter: defaultFilter(),
        categoryFilter: defaultFilter(),
        page: 0
    }
}