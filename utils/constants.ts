import { env } from "process"

export const dbSuffix = 'discount_discovery_'
export const dbRemoteUrl_name = 'dbRemoteUrl'
export const sideBarOpen_name = 'sideBarOpen'
export const dbLoggedIn_name = 'dbLoggedIn'
export const categories_name = 'categories'
export const settings_name = 'settings'
export const products_name = 'products'
export const shops_name = 'shops'
export const true_string = 'true'

export const dbUser = env.COUCHDB_USER
export const dbPassword = env.COUCHDB_PASSWORD
export const dbUrl = env.DISCOUT_DISCOVERY_DB_URL
export const dbSetup = Boolean(env.DISCOUT_DISCOVERY_DB_SETUP?.toLowerCase() == true_string)

