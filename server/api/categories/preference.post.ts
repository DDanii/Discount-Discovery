import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const userId = 1

  const body = await readBody(event)
  const value = body.value as boolean
  const category = body.category as string

  await prisma.categoryPreference.upsert({
      where: { userId_category: { userId: userId, category: category } },
      create: { userId: userId, category: category, value: value },
      update: { value: value }
  })
  
  event.node.res.statusCode = 200
  event.node.res.end()
})