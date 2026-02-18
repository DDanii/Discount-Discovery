import prisma, { Category, Preference, Product, Shop } from "~/utils/prisma";
import { ProductWithPreference } from "~/utils/types/productWithPreference";

export default defineEventHandler(async (event) => {
  const userId = 1
  const now = new Date()
  const prefs = (
    await prisma.product.findMany({
      include: {
        preferences: {
          where: {
            userId: userId
          }
        },
        shop: true,
        categoryModel: true
      },
    })
  );
  const prods = prefs
    .map(p => mapToProductWithPreference(p))

  return prods ;

  function mapToProductWithPreference(product: databaseProduct): ProductWithPreference {
    return {
      ...product,
      preference: product.preferences?.[0]?.value ?? null,
      startDate: product.startDate.getTime(),
      endDate: product.endDate.getTime()
    }
  }


  type databaseProduct = Product & {
    shop: Shop,
    preferences: Preference[],
    categoryModel: Category | null
  }
});