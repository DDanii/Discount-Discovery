import {
    type ProductByCategoryFilters,
    type Settings as DbSettings,
    type CategoryFilters,
    type ProductFilters,
    type ShopSettings
} from "~/utils/prisma"

export type Settings = DbSettings & {
    productFilters: ProductFilters,
    categoryFilters: CategoryFilters,
    shopSettings: ShopSettings,
    productByCategoryFilters: ProductByCategoryFilters
} | null