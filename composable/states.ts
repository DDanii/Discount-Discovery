import { sideBarOpen_name, dbLoggedIn_name, dbSyncing_name, dbOffline_name, dbUrlIsSet_name } from "~/utils/constants"

export const useSideBarOpen = createState(sideBarOpen_name, () => false)

export const useDBLoggedIn = createState(dbLoggedIn_name, () => false)

export const useDBSyncing = createState(dbSyncing_name, () => false)

export const useDBOffline = createState(dbOffline_name, () => true)

export const useDBUrlIsSet = createState(dbUrlIsSet_name, () => false)


function createState<T>(id: string, fn: () => T): () => globalThis.Ref<T, T>{
    if (import.meta.client)
        return () => useState<T>(id, fn)
    return () => ({value: fn()} as globalThis.Ref)
}