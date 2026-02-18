import prisma from "~/utils/prisma";
import { filterSpread } from "~/utils/services/settings";
import { FilterType, TypedFilter } from "~/utils/types/Filter";

export default defineEventHandler(async (event) => {
  const userId = 1;

  const body = (await readBody(event)) as TypedFilter;
  const settings = await prisma.settings.upsert({
    where: { userId: userId },
    create: { userId: userId },
    update: {}
  });

  const upsert = {
    where: { userId: settings.userId },
    create: { ...filterSpread(body), userId: settings.userId },
    update: { ...filterSpread(body) }
  }

  switch (body.type) {
    case FilterType.Product:
      await prisma.productFilters.upsert(upsert)
    case FilterType.Category:
      await prisma.categoryFilters.upsert(upsert)
    case FilterType.ProductByCategory:
      await prisma.productByCategoryFilters.upsert(upsert)
  }

  event.node.res.statusCode = 200
  event.node.res.end()
})