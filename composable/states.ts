import type listQuery from "~/utils/types/listQuery";

export const useListQuery = () => 
    useState<listQuery>('listQuery', () => ({
        liked: true,
        neutral: true, 
        disliked: true, 
        page: 0, 
        counter: 0
    }))

export const useSideBarOpen = () => 
    useState<boolean>('sideBarOpen', () => false)
