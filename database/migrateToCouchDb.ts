import prisma, {
    type CategoryPreference,
    type Preference as PrismaPreference,
    type Product as PrismaProduct,
    type Shop as PrismaShop
} from "../utils/prisma"
import { DBName, DB, DBLocation } from "./database";
import type { Product } from "../utils/types/product";
import type { Shop } from "../utils/types/shop";
import type { Argument } from "../utils/types/shopConfig";
import { PreferenceType, type Preference } from "../utils/types/preference";
import { dbPassword, dbUrl, dbUser, settings_name } from "../utils/constants"
import PouchDB from 'pouchdb';

export default async function migrateToCouchDb() {

    if (!dbUser) throw new Error('db user env not set')
    if (!dbPassword) throw new Error('db password env not set')
    if (!dbUrl) throw new Error('db url env not set')

    DB.setRemoteUrl(dbUrl)
    DB.setRemoteUser(dbUser)
    const productDB = new DB<Product>(DBLocation.remote, DBName.product, dbUser, dbPassword)

    if ((await productDB.info()).doc_count > 0) return

    const products = await prisma.product.findMany()
    productDB.bulkDocs(products.map(p => productMigrate(p)))

    const categoryDB = new DB(DBLocation.remote, DBName.category, dbUser, dbPassword)
    const categories = await prisma.category.findMany()
    categoryDB.bulkDocs(
        categories.map(c => { return { _id: c.name } })
    )

    const shopDB = new DB(DBLocation.remote, DBName.shop, dbUser, dbPassword)
    const shops = await prisma.shop.findMany({
        include: {
            shopSettings: true,
            shopArguments: true
        }
    })
    shopDB.bulkDocs(shops.map(shopMigrate))

    const userDB = new DB(DBLocation.remote, DBName.user, dbUser, dbPassword)
    const settings = await prisma.settings.findFirst({
        where: {
            userId: 1
        },
        include: {
            productFilters: true,
            categoryFilters: true,
            productByCategoryFilters: true,
        }
    })

    userDB.put({ ...settings, _id: settings_name })

    const preferences = await prisma.preference.findMany({ where: { userId: 1 }, include: { product: true } })
    userDB.bulkDocs(preferences.map(preferenceMigrate))

    const categoryPreferences = await prisma.categoryPreference.findMany({ where: { userId: 1 } })
    userDB.bulkDocs(categoryPreferences.map(categoryPreferenceMigrate))
}

type PrismaPreferenceWithProduct = PrismaPreference & { product: PrismaProduct };

function categoryPreferenceMigrate(category: CategoryPreference): Preference {
    return {
        _id: category.category,
        value: category.value,
        type: PreferenceType.category
    }
}

function preferenceMigrate(preference: PrismaPreferenceWithProduct): Preference {
    return {
        _id: productMigrate(preference.product)._id,
        value: preference.value,
        type: PreferenceType.product
    }
}
function shopMigrate(shop: PrismaShopFull): Shop {
    return {
        _id: shop.id.toString(),

        name: shop.name,
        icon: shop.icon,
        source: shop.source,
        country: shop.country,
        lastUpdated: (shop.lastUpdated ?? new Date()).getTime(),

        enabled: shop.shopSettings?.first()?.enabled ?? true,
        shopArguments: shop.shopArguments?.map(migrateArgument) ?? null
    }
}

function migrateArgument(argument: PrismaArgument): Argument {
    return {
        ...argument,
        required: argument.required ?? undefined,
        defaultValue: argument.defaultValue ?? undefined
    }
}

function productMigrate(product: PrismaProduct): Product {
    return {
        ...product,
        _id: `${product.shopId}:${product.externalId}`,
        shopId: product.shopId.toString(),
        startDate: product.startDate.getTime(),
        endDate: product.endDate.getTime()
    }
}

type PrismaShopFull = PrismaShop & {
    shopArguments: PrismaArgument[] | null,
    shopSettings: {
        enabled: boolean
    }[] | null
}

type PrismaArgument = {
    argument: string,
    label: string,
    required: boolean | null
    defaultValue: string | null
}