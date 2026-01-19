import prisma from "~/lib/prisma";
import type { Settings } from "../types/settings";
import type { PreferenceFilter } from "../types/ListQuery";

export async function getSettings(userId: number): Promise<Settings> {
    return (await prisma.settings.findUnique({
        where: { userId: userId },
        include: { productFilters: true, categoryFilters: true, ShopSettings: true }
    })) as Settings
}

export function filterSpread(filter: PreferenceFilter): PreferenceFilter {
    return {
        liked: filter.liked,
        neutral: filter.neutral,
        disliked: filter.disliked
    }
}