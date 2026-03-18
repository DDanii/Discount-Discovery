import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
import PouchDBUpesert from 'pouchdb-upsert';
//import PouchDBMemory from 'pouchdb-adapter-memory';
import PouchDBFind from 'pouchdb-find'
import type { Preference } from '../utils/types/preference';
import type { Product } from '../utils/types/product';
import { defaultSettings, type Settings } from '../utils/types/settings';
import type { Shop } from '../utils/types/shop';
import type { Category } from '../utils/types/category';
import { dbSuffix } from '../utils/constants';
import { Buffer } from "buffer";
import { exit } from 'process';

//PouchDB.plugin(PouchDBMemory)
PouchDB.plugin(PouchDBAuthentication)
PouchDB.plugin(PouchDBFind)
PouchDB.plugin(PouchDBUpesert)

const syncParameters = { live: true, retry: true, auto_compaction: true }

export enum DBName {
    user = 'user',
    shop = 'shop',
    product = 'product',
    category = 'category'
}

export enum DBLocation {
    mem = 'mem',
    local = 'local',
    remote = 'remote'
}

export class DB<T extends {} = {}> extends PouchDB<T> {
    private static url: string | null
    private static user: string | null
    private static remoteSyncStatus = [] as PouchDB.Replication.Sync<any>[]

    constructor(location: DBLocation, name: DBName, user?: string, password?: string) {
        if (user && password) {
            DB.user = user
            super(DB.dbParameters(location, name)[0], {
                auth: {
                    username: user,
                    password: password
                }
            })
            this.remoteIsLoggedIn().then((respones) => {
                if (respones) return
                console.log("Database login failed")
                exit(1)
            })
        } else {
            super(...DB.dbParameters(location, name));
        }
    }

    private static dbParameters(location: DBLocation, db: DBName): [string, {}] {
        let suffix = dbSuffix
        let name = db.toString()
        let url = ''
        let dbParameters = {}

        switch (location) {
            case DBLocation.mem:
                //dbParameters = { adapter: 'memory' } //todo
                break;
            case DBLocation.remote:
                if (!DB.url) throw new Error('remote db url not set')
                url = DB.url
                if (db == DBName.user) {
                    suffix = ''
                    name = DB.userNameToDBName()
                }
        }
        return [`${url}${suffix}${name}`, dbParameters]
    }

    private static userNameToDBName(): string {
        if (!DB.user) throw new Error('DB user not set')
        return 'userdb-' + Buffer.from(DB.user).toString('hex');
    }

    public static setRemoteUser(dbUser: string) {
        DB.user = dbUser
    }

    public async remoteIsLoggedIn(): Promise<boolean> {
        return Boolean(await this.getUserName())
    }

    public async getUserName(): Promise<string | null> {
        try {
            const session = await this.getSession();
            const name = session.userCtx?.name
            if (name) DB.user = name
            return name

        } catch (error) {
            console.log(error)
            return null
        }
    }

    public static urlIsSet(): boolean {
        return Boolean(DB.url)
    }

    public static setRemoteUrl(url: string | null) {
        if (url && !url?.endsWith('/'))
            url += '/'
        DB.url = url
    }

    public static loopAll(fn: { (arg0: DBName): void }) {
        for (let item in DBName) {
            const dbType = DBName[item as keyof typeof DBName]
            fn(dbType)
        }
    }

    public static localSync() {
        DB.loopAll((dbType) => {
            const memDB = new DB(DBLocation.mem, dbType)
            const localDB = new DB(DBLocation.local, dbType)
            localDB.sync(memDB, syncParameters)
        })
    }

    public static remoteSync() {
        DB.loopAll(async (dbType) => {
            const localDB = new DB(DBLocation.local, dbType)
            const remoteDB = new DB(DBLocation.remote, dbType)
            DB.remoteSyncStatus.push(localDB.sync(remoteDB, syncParameters))
        })
    }

    public override logOut() {
        DB.remoteSyncStatus.forEach((sync) => sync.cancel())
        DB.remoteSyncStatus = [] as PouchDB.Replication.Sync<any>[]
        return super.logOut()
    }
}

export class PreferencesDB extends DB<Preference> {
    constructor() {
        super(DBLocation.mem, DBName.user);

    }
}

export class ProductsDB extends DB<Product> {
    constructor() {
        super(DBLocation.mem, DBName.product);

    }
}

export class CategoryDB extends DB<Category> {
    constructor() {
        super(DBLocation.mem, DBName.category);

    }
}

export class ShopDB extends DB<Shop> {
    constructor() {
        super(DBLocation.mem, DBName.shop);

    }
}

export function getDocs<T extends {}>(dbData: PouchDB.Core.AllDocsResponse<T>): T[] {
    return dbData.rows.map(r => docMap(r.doc))
}

export function docMap<T extends {}>(doc: PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta> | undefined): T {
    delete doc?._attachments
    delete doc?._conflicts
    return doc ?? {} as T
}

// export async function prefFilteringSetup(filter: Filter, type: PreferenceType): Promise<FilteringSetupResult> {
//     let prefFilter = {} as PouchDB.Find.ConditionOperators
//     const preferencesDB = new PreferencesDB
//     if (filter.neutral) {
//         prefFilter = { $nin: creataInvertedFilterList(filter) }
//     } else {
//         prefFilter = { $in: createFilterList(filter) }
//     }
//     const wantedPreferences = (await preferencesDB.find({
//         selector: {
//             $and: [
//                 { type: type },
//                 { value: prefFilter }
//             ]
//         }
//     })).docs;

//     const idList = wantedPreferences.map(d => d._id)

//     let result = {} as FilteringSetupResult

//     result.wantedPrefs = wantedPreferences

//     if (filter.neutral) {
//         result.filterOperator = { $nin: idList }
//     } else {
//         result.filterOperator = { $in: idList }
//     }

//     return result
// }

export async function getSettings(): Promise<Settings> {
    const userDB = new DB<Settings>(DBLocation.mem, DBName.user)
    try {
        const settings = await userDB.get(settings_name)
        return settings
    } catch (error: any) {
        if (error.message == "missing")
            await setSettings(defaultSettings())
        else
            console.log(error)
        return defaultSettings()
    }
}

export async function setSettings(settings: Settings) {
    const userDB = new DB<Settings>(DBLocation.mem, DBName.user)
    return await userDB.upsert(settings_name, (doc) => { return settings })
}