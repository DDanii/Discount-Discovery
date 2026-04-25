import { ProductsService } from "~/utils/services/productsService";
import { dbPassword, dbSetup, dbUrl, dbUser } from "~/utils/constants";
import { setTimeout } from "timers/promises";

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

  if (!dbUrl) throw new Error('db url env not set')
  if (!dbUser) throw new Error('db user env not set')
  if (!dbPassword) throw new Error('db password env not set')

  if (dbSetup) {
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

  }

  const productsService = new ProductsService()
  productsService.fetch()
});