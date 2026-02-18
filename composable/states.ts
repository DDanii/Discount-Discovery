import type { Settings } from "~/utils/types/settings";

export const settings_name = 'settings'
export const categories_name = 'categories'
export const product_name = 'product'

export const useSideBarOpen = () =>
    useState<boolean>('sideBarOpen', () => false)

export const useSettings = () =>
    useState<Settings>(settings_name, () => { return {} as Settings})