import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const value = body.value as boolean
  const productId = body.productId as number

  await prisma.preference.upsert({
      where: { userId_productId: { userId: 1, productId: productId } },
      create: { userId: 1, productId: productId, value: value },
      update: { value: value }
  })
  event.node.res.statusCode = 200
  event.node.res.end()
})