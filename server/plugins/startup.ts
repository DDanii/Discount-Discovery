import { ProductsService } from "~/utils/services/productsService";
import migrateToCouchDb from "~/database/migrateToCouchDb"
import { dbPassword, dbSetup, dbUrl, dbUser } from "~/utils/constants";
import { DB } from "~/database/database";
import { setTimeout } from "timers/promises";
import { exec } from "child_process";
import util from 'node:util'

declare global {
  interface Array<T> {
    first(): T | undefined;
  }
}

Object.defineProperty(Array.prototype, 'first', {
  value: function (this: any[]) {
    return this[0];
  },
  enumerable: false,
  configurable: true,
  writable: true
});

export default defineNitroPlugin(async () => {

  if (!dbUser) throw new Error('db user env not set')
  if (!dbPassword) throw new Error('db password env not set')
  if (!dbUrl) throw new Error('db url env not set')

  const execWithPromise = util.promisify(exec)
  const child = execWithPromise('npx prisma migrate deploy', {
    env: process.env   // Pass env vars
  })
  child.then(
    (value: { stdout: string, stderr: string }) => {
      if (value.stderr) {
        console.error(`exec error: ${value.stderr}`);
        return;
      }
      console.log(`stdout: ${value.stdout}`);
    })
  await child
  if (dbSetup) {
    DB.setRemoteUrl(dbUrl)
    const headers = { Authorization: 'Basic ' + btoa(`${dbUser}:${dbPassword}`) }

    await fetch(`${dbUrl}/_node/_local/_config/admins/${dbUser}`, { body: `"${dbPassword}"`, method: "PUT", headers: headers })
    await setTimeout(1000)
    await fetch(`${dbUrl}/_users`, { method: "PUT", headers: headers })
    await setTimeout(1000)
    await fetch(`${dbUrl}/_replicator`, { method: "PUT", headers: headers })
    await setTimeout(1000)
    await fetch(`${dbUrl}/_node/_local/_config/chttpd_auth/allow_persistent_cookies`, { body: `"true"`, method: "PUT", headers: headers })
    await fetch(`${dbUrl}/_node/_local/_config/chttpd/enable_cors`, { body: `"true"`, method: "PUT", headers: headers })
    await fetch(`${dbUrl}/_node/_local/_config/cors/origins`, { body: `"*"`, method: "PUT", headers: headers })
    await fetch(`${dbUrl}/_node/_local/_config/cors/credentials`, { body: `"true"`, method: "PUT", headers: headers })
    await fetch(`${dbUrl}/_node/_local/_config/couch_peruser/enable`, { body: `"true"`, method: "PUT", headers: headers })

    // DB.loopAll(async (dbName) => { todo
    //   if (dbName == DBName.user) return


    //   const db = new DB<{}>(DBLocation.remote, dbName, dbUser, dbPassword)
    //   const name = (await db.info()).db_name
    //   await setTimeout(1000)
    //   // await setTimeout(1000)
    //   // const readOnlyRuleBody = {
    //   //   validate_doc_update: `function(newDoc, oldDoc, userCtx) { if (userCtx.name !== '${dbUser}') { return; } else { throw({forbidden: 'Only ${dbUser} can edit!'})}}`,
    //   //   // views: {
    //   //   //   name:{
    //   //   //     map: "function(doc)  { emit(doc._id); }"
    //   //   //   }
    //   //   // }
    //   // }
    //   // console.log(JSON.stringify(readOnlyRuleBody))

    //   // console.log(await fetch(`${dbUrl}/${name}/_desing/readOnly`, {  headers: headers }))
    //   // await fetch(`${dbUrl}/${name}/_desing/readOnly`, { body: JSON.stringify(readOnlyRuleBody), method: "PUT", headers: headers })

    // })

  }

  await migrateToCouchDb();
  const productsService = new ProductsService()
  productsService.fetch()
});