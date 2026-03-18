export const useSideBarOpen = () =>
    useState<boolean>(sideBarOpen_name, () => false)

export const useDBLoggedIn = () =>
    useState<boolean>(dbLoggedIn_name, () => false)