import prisma from "~/lib/prisma";
import type ProductWithPreference from "~/utils/types/productWithPreference";
import type listQuery from "~/utils/types/listQuery";

const pageSize = 10;

export default defineEventHandler(async (event) => {
  const now = new Date()
  const prefs = (
    await prisma.user.findUnique({
      where: {
        id: 1,
        AND: {
          preferences: {
            some: {
              product: { 
                endDate: { 
                  gt: now 
                },
                AND: {
                  startDate: {
                    lt: now
                  }
                }
              } 
            }
          }
        }
      },
      include: {
        preferences: { include: { product: true } },
      },
    })
  )?.preferences;

  const noPrefs = (
    await prisma.product.findMany({
      where: { Preference: { none: { userId: 1 } }, AND: { endDate: { gt: now }, startDate: { lt: now } } },
    })
  ).map((p) => ({ ...p, preference: null })) as ProductWithPreference[];

  let prods =
    prefs?.map(
      (p) => ({ ...p.product, preference: p.value }) as ProductWithPreference
    ) ?? ([] as ProductWithPreference[]);
  prods.push(...noPrefs);
  const query = getQuery(event) as unknown as listQuery;
  const pageNum = parseInt(query?.page as unknown as string) || 0;
  const filterList = createFilterList(query);
  prods = prods.filter((p) => filterList.includes(p.preference)); 

  return { productList: prods.slice(pageSize * pageNum, pageSize * pageNum + pageSize) };
});

function createFilterList(query: listQuery): (boolean|null)[] {
  const filterList= [];
  if(query?.liked as unknown === "true") filterList.push(true);
  if(query?.disliked as unknown === "true") filterList.push(false);
  if(query?.neutral as unknown === "true") filterList.push(null);
  return filterList;
}