import prisma, { CategoryPreference, Preference, Product, Shop } from "~/lib/prisma";
import type ProductWithPreference from "~/utils/types/productWithPreference";
import { listVariables, pageSize, pageSlice } from "~/utils/utils";

export default defineEventHandler(async (event) => {
  const userId = 1
  const now = new Date()
  const prefs = (
    await prisma.product.findMany({
      where: {
        endDate: {
          gt: now
        },
        AND: {
          startDate: {
            lt: now
          }
        }
      },
      include: {
        preferences: {
          where: {
            userId: userId
          }
        },
        shop: true,
        categoryModel: {
          include: {
            categoryPreferences: {
              where: {
                userId: userId
              }
            }
          }
        }
      },
    })
  );

  const [pageNum, filterList] = listVariables(event)
  const prods = prefs
    .filter((p) => filterList.includes(listPreferenceValue(p)))
    .map(p => mapToProductWithPreference(p))
    .slice(...pageSlice(pageSize, pageNum))

  return { productList: prods };

  function mapToProductWithPreference(product: databaseProduct): ProductWithPreference {
    return {
      ...product,
      preference: product.preferences.first()?.value ?? null,
      startDate: product.startDate.toDateString(),
      endDate: product.endDate.toDateString()
    }
  }

  function listPreferenceValue(p: databaseProduct): boolean | null {
    const productPreference = p.preferences.first()?.value
    const categoryPreference = p.categoryModel?.categoryPreferences.first()?.value
    return productPreference ?? categoryPreference ?? null
  }

  type databaseProduct = Product & {
    shop: Shop,
    preferences: Preference[],
    categoryModel: {
      categoryPreferences: CategoryPreference[]
    } | null
  }
});