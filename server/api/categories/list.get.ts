import prisma, { Category, CategoryPreference } from "~/lib/prisma"
import type CategoryWithPreference from "~/utils/types/categoryWithPreference"
import { listVariables, pageSize, pageSlice } from "~/utils/utils"

export default defineEventHandler(async (event) => {
    const userId = 1

    const categories = await prisma.category.findMany({
        include: { categoryPreferences: { where: { userId: userId } } }
    })

    const [pageNum, filterList] = listVariables(event)

    const categoryList = categories
        .map(c => mapToCategoryWithPreference(c))
        .filter(c => filterList.includes(c.preference))
        .slice(...pageSlice(pageSize, pageNum))

    return { categoryList: categoryList }

    function mapToCategoryWithPreference(category: databaseCategory): CategoryWithPreference {
        return {
            name: category.name,
            preference: category.categoryPreferences.first()?.value ?? null
        }
    }

    type databaseCategory = Category & {
        categoryPreferences: CategoryPreference[]
    }
})