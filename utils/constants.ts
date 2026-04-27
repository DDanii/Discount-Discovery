import { env } from "process"

export const dbSuffix = 'discount_discovery_'
export const dbRemoteUrl_name = 'dbRemoteUrl'
export const sideBarOpen_name = 'sideBarOpen'
export const categories_name = 'categories'
export const dbLoggedIn_name = 'dbLoggedIn'
export const dbUrlIsSet_name = 'dbUrIslSet'
export const dbSyncing_name = 'dbSyncing'
export const dbOffline_name = 'dbOffline'
export const settings_name = 'settings'
export const products_name = 'products'
export const shops_name = 'shops'
export const true_string = 'true'

export const dbUser = env.COUCHDB_USER
export const dbPassword = env.COUCHDB_PASSWORD
export const dbUrl = env.DISCOUT_DISCOVERY_DB_URL
export const dbSetup = isTrueString(env.DISCOUT_DISCOVERY_DB_SETUP)
export const debugSaveFetch = isTrueString(env.DISCOUT_DISCOVERY_DEBUG_SAVE_FETCH)
export const debugSavePath = env.DISCOUT_DISCOVERY_DEBUG_SAVE_PATH ?? "/config/debug"

function isTrueString(str: string | undefined): boolean{
    return str?.toLowerCase() == true_string
}