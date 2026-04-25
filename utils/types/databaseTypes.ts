import type { SyncStatus } from "~/database/database"
import type { GenericPreference } from "./preference"

export type DatabaseDoc = {
    _id: string
}

export function databaseDocsEqual(first: DatabaseDoc, second: DatabaseDoc): boolean {
    return first._id == second._id
}

export type DocWithPref =
    DatabaseDoc & GenericPreference

export interface SyncStatusDictionary {
    [index: string]: SyncStatus;
}