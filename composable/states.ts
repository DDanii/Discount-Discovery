import type { listQuery } from "~/utils/types/listQuery";
import { defaultListQuery } from "~/utils/types/listQuery";

export const useListQuery = () =>
    useState<listQuery>('listQuery', () => defaultListQuery)

export const useCategoryListQuery = () =>
    useState<listQuery>('categoryListQuery', () => defaultListQuery)

export const useSideBarOpen = () =>
    useState<boolean>('sideBarOpen', () => false)
