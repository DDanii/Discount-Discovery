import { getSettings } from "@@/utils/services/settings"

export default defineEventHandler(async () => {
    const userId = 1

    const settings = await getSettings(userId);

    return { settings: settings }
})