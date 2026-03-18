import { databaseDocsEqual, type DatabaseDoc } from "./databaseTypes"
import type { GenericPreference } from "./preference"

export type Product = DatabaseDoc & {
  shopId: string,
  endDate: number,
  startDate: number,
  externalId: string,
  url: string | null,
  unit: string | null,
  name: string | null,
  image: string | null,
  price: number | null,
  warning: string | null,
  category: string | null,
  description: string | null,
  pricePerUnit: number | null,
}

export type ProductWithPreferences =
  Product & GenericPreference

export function productsEqual(first: Product, second: Product): boolean {
  return databaseDocsEqual(first, second) &&
    first.url == second.url &&
    first.unit == second.unit &&
    first.shopId == second._id &&
    first.name == second.name &&
    first.image == second.image &&
    first.price == second.price &&
    first.warning == second.warning &&
    first.endDate == second.endDate &&
    first.category == second.category &&
    first.startDate == second.startDate &&
    first.externalId == second.externalId &&
    first.description == second.description &&
    first.pricePerUnit == second.pricePerUnit
}