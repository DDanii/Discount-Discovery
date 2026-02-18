import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { env } from 'prisma/config';
import { PrismaClient } from '_db'
export * from '_db'

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3({
    url: env('DATABASE_URL')
  })
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
