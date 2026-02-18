import prisma, { Category, CategoryPreference } from "~/utils/prisma"
import type { CategoryWithPreference } from "~/utils/types/categoryWithPreference"

export default defineEventHandler(async (event) => {
    const userId = 1

    const categories = await prisma.category.findMany({
        include: { categoryPreferences: { where: { userId: userId } } }
    })

    const categoryList = categories
        .map(c => mapToCategoryWithPreference(c))

    return categoryList

    function mapToCategoryWithPreference(category: databaseCategory): CategoryWithPreference {
        return {
            name: category.name,
            preference: category.categoryPreferences?.[0]?.value ?? null
        }
    }

    type databaseCategory = Category & {
        categoryPreferences: CategoryPreference[]
    }
})