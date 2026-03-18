import type { DatabaseDoc } from "./databaseTypes"

export type Preference = DatabaseDoc & {
    value: boolean | null
    type: PreferenceType
}

export enum PreferenceType {
    product,
    category
}

export type GenericPreference = {
    preference: boolean | null
}