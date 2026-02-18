import prisma from "~/utils/prisma";
import type { Settings } from "../types/settings";
import type { Filter, TypedFilter } from "../types/Filter";

export async function getSettings(userId: number): Promise<Settings> {
    return (await prisma.settings.findUnique({
        where: { userId: userId },
        include: {
            productFilters: true, 
            categoryFilters: true, 
            ShopSettings: true, 
            productByCategoryFilters: true
        }
    })) as Settings
}

export function filterSpread(filter: TypedFilter): Filter {
    return {
        liked: filter.liked,
        neutral: filter.neutral,
        disliked: filter.disliked
    }
}