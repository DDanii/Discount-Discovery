import type { DatabaseDoc } from "./databaseTypes"
import type { GenericPreference } from "./preference"

export type Category = DatabaseDoc

export type CategoryWithPreference =
    Category & GenericPreference