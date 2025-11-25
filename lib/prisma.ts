import { PrismaClient } from '_db'
export * from '_db'

const prismaClientSingleton = () => {
  return new PrismaClient({
    transactionOptions: {
      timeout: 30000
    }
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
