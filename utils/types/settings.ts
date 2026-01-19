import { type Settings as DbSettings, type CategoryFilters, type ProductFilters, type ShopSettings } from "~/lib/prisma"

export type Settings = DbSettings & {
    productFilters: ProductFilters,
    categoryFilters: CategoryFilters,
    shopSettings: ShopSettings
 } | null