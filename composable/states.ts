import { defaultListQuery, type ListQuery } from "~/utils/types/ListQuery";

export const listQuery_name = 'listQuery'
export const categoryListQuery_name = 'categoryListQuery'

export const useListQuery = () =>
    useState<ListQuery>(listQuery_name, defaultListQuery)

export const useCategoryListQuery = () =>
    useState<ListQuery>(categoryListQuery_name, defaultListQuery)

export const useSideBarOpen = () =>
    useState<boolean>('sideBarOpen', () => false)
