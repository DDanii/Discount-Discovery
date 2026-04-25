/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse as HTMLParse } from "node-html-parser";
import { readdirSync, readFileSync } from "fs";
import {
  type ParseStep, StepType, type SetPropParameters,
  type ForEachParameters, type PushToArrayParameters,
  type ConcatParameters, type SliceParameters, type SplitParameters,
  type ReplaceParameters, type FetchParameters, type SpreadParameters,
  type HTMLQuerySelectorParameters, type IfParameters,
  type ShopConfig
} from "../types/shopConfig";
import { parse as YamlParse } from "yaml";
import { shopConfigSchema } from "../validators/shopConfigSchema";
import { CronJob } from "cron";
import { deepCopy } from "../utils";
import { DB, DBLocation, DBName, docMap } from "~/database/database";
import type { Shop } from "../types/shop";
import { productsEqual, type Product } from "../types/product";
import type { Category } from "../types/category";
import { dbUrl, dbUser, dbPassword } from "../constants"
import { setTimeout } from "timers/promises";

const cacheDateDifference = 43400000;
const defaultCron = "0 7 * * *";
const jobs = [] as CronJob[]

export class ProductsService {

  public async fetch() {
    const files = readdirSync('store')
    for (const fname of files) {
      if (fname.endsWith(".yml"))
        await handleConfigFile(fname)
    }
  }
}

async function handleConfigFile(fname: string) {
  console.log(`Handling file: ${fname}`)
  DB.setRemoteUrl(dbUrl ?? null)
  const shopDB = new DB<Shop>(DBLocation.remote, DBName.shop, dbUser, dbPassword)
  if(!await shopDB.isRemoteLoggedIn()) return

  try {
    const file = readFileSync(`store/${fname}`, 'utf8')
    const raw = YamlParse(file)
    const config = shopConfigSchema.safeParse(raw)

    if (!config.success) {
      console.log("Parse error")
      console.log(fname)
      console.log(config.error)
      return
    }

    const shopDoc = {
      source: fname,
      name: config.data.name,
      icon: config.data.icon,
    } as Shop

    let shopId: string

    let shop = docMap((await shopDB.find({ selector: { source: { $eq: fname } } })).docs[0])
    if (shop._id) {
      shopId = shop._id
      shopDoc._id = shopId
      shopDB.upsert(shopDoc._id, (doc) => {
        Object.assign(doc, shopDoc)
        return doc as Shop
      })
    } else {
      const response = await shopDB.post(shopDoc)
      shopId = response.id
      shop = await shopDB.get(shopId)
    }

    const job = new CronJob(config.data.cron ?? defaultCron, async () => {
      await setTimeout(Math.random()*100000)
      await new Gathering().run(config.data, shopId)
    }, null, true //TODO handle timezone
    )
    const dates = job.nextDates(2)

    const cronDiff = (dates[1]?.toMillis() ?? cacheDateDifference) - (dates[0]?.toMillis() ?? 0)

    if (!shop.lastUpdated || ((dates[0]?.toMillis() ?? 0) - shop.lastUpdated) > cronDiff) {
      await new Gathering().run(config.data, shopId);
    }

    jobs.push(job)
  }
  catch (e) {
    console.log("Shop handle error")
    console.log(fname)
    console.log(e)
  }
}

class Gathering {

  constructor() {
    this.productDB = new DB<Product>(DBLocation.remote, DBName.product, dbUser, dbPassword)
    this.categryDB = new DB<Category>(DBLocation.remote, DBName.category, dbUser, dbPassword)
    this.shopDB = new DB<Shop>(DBLocation.remote, DBName.shop, dbUser, dbPassword)
    this.year = (new Date()).getFullYear()
    this.month = (new Date()).getMonth()
    this.tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  }

  year: number
  month: number
  tomorrow: Date
  shopDB: DB<Shop>
  productDB: DB<Product>
  categryDB: DB<Category>

  public async run(config: ShopConfig, shopId: string) {

    let data = { DDParsedProducts: [], currentYear: this.year.toString() };
    data = await stepsManager(config.steps, data)

    this.gatherCategories(data.DDParsedProducts)
    await this.handleProducts(data.DDParsedProducts, config, shopId)

    await this.shopDB.upsert(shopId, (doc) => {
      doc.lastUpdated = new Date().getTime()
      return doc as Shop
    })

    this.shopDB.logOut()
    this.productDB.logOut()
    this.categryDB.logOut()
    console.log(`Shop with id: ${shopId} done`)
  }

  private async gatherCategories(products: Product[]) {
    const filtered = products.map(p => p.category ?? "")
      .filter(c => c !== "")
      .filter(this.onlyUnique)

    for (const category of filtered) {
      const result = await this.categryDB.putIfNotExists({ _id: category })
    }
  }

  private onlyUnique(value: string, index: number, array: string[]) {
    return array.indexOf(value) === index;
  }

  private async handleProducts(products: Product[], config: ShopConfig, shopId: string) {
    const mappedProducts = products.map(p => this.mapDates(p, config))
    console.log(`fetched ${mappedProducts.length} product(s)`)

    for (const product of mappedProducts)
       await this.saveProduct(product, shopId)
  }

  private async saveProduct(product: Product, shopId: string) {
    await setTimeout(100)
    const id = `${shopId}:${product.externalId}`

    await this.productDB.upsert(id, (doc) => {
      if (productsEqual({ ...product, _id: id }, doc as Product)) return false
      Object.assign(doc, product)
      doc.shopId = shopId
      return doc as Product
    })
  }

  private mapDates(product: Product, config: ShopConfig): Product {
    const startDate = product.startDate ? new Date(product.startDate) : new Date();
    const endDate = product.endDate ? new Date(product.endDate) : this.tomorrow;

    if (config.autoCorrectYears) this.correctYears(startDate, endDate)
    if (config.setEndDateToDayEnd) endDate.setHours(23, 59)

    product.startDate = startDate.getTime();
    product.endDate = endDate.getTime();
    return product
  }

  private correctYears(startDate: Date, endDate: Date) {
    if (this.month == 11) {
      if (startDate.getMonth() == 0)
        startDate.setFullYear(this.year + 1)
      if (endDate.getMonth() == 0)
        endDate.setFullYear(this.year + 1)
    }
    else if (this.month == 0) {
      if (startDate.getMonth() == 11)
        startDate.setFullYear(this.year - 1)
      if (endDate.getMonth() == 11)
        endDate.setFullYear(this.year - 1)
    }
  }
}

async function stepsManager(steps: ParseStep[], data: any): Promise<any> {
  if (!steps) {
    return data
  }

  while (steps.length > 0 && steps[0]) {
    data = { ...data, ...(await stepResolver(steps[0], data)) }
    steps.shift()
  }

  return data
}

async function stepResolver(step: ParseStep, data: any): Promise<any> {
  switch (step.stepParameters.method) {

    case StepType.Literal:
      data = setValue(data, step.stepParameters.destination ?? "data", step.stepParameters.data)
      break
    case StepType.Fetch:
      data = await FetchStep(step.stepParameters, data)
      break
    case StepType.SetProp:
      data = setProp(step.stepParameters, data)
      break
    case StepType.ParseJSON:
      data.data = JSON.parse(data.data)
      break
    case StepType.ForEach:
      data = await forEachStep(step.stepParameters, data)
      break
    case StepType.CreateArray:
      data[step.stepParameters.name] = []
      break
    case StepType.PushToArray:
      data = pushToArray(step.stepParameters, data)
      break
    case StepType.ParseHTML:
      data.data = HTMLParse(data.data);
      break;
    case StepType.HTMLQuerySelector:
      data = HTMLQuerySelector(step.stepParameters, data)
      break;
    case StepType.Concat:
      data = ConcatStep(step.stepParameters, data)
      break;
    case StepType.ToString:
      data.data = data.data.toString()
      break;
    case StepType.HTMLClone:
      data[step.stepParameters.destination] = data.data.clone()
      break;
    case StepType.DeepCopy:
      data.data = deepCopy(data.data)
      break;
    case StepType.Slice:
      data = SliceStep(step.stepParameters, data)
      break;
    case StepType.Split:
      data = SplitStep(step.stepParameters, data)
      break;
    case StepType.Replace:
      data = ReplaceStep(step.stepParameters, data)
      break;
    case StepType.Spread:
      data = SpreadStep(step.stepParameters, data)
      break;
    case StepType.If:
      data = await IfStep(step.stepParameters, data)
      break;
  }
  return data
}

async function FetchStep(parameters: FetchParameters, data: any): Promise<any> {
  console.log(`fetching: ${data.data}`)
  const request = new Request(data.data)
  if (parameters.headersSource) {
    for (const header of data[parameters.headersSource]) {
      const key = Object.keys(header)[0];
      const value = Object.values<string>(header)[0];
      if (key && value) {
        request.headers.set(key, value);
      }
    }
  }
  const response = await fetch(request);
  if (!response.ok)
    console.log(`${response.url}: ${response.status}`)
  data.data = await (response).text()
  return data;
}

function SliceStep(parameters: SliceParameters, data: any): any {
  data.data = data.data.slice(parameters.start, parameters.end)
  return data
}

function ConcatStep(step: ConcatParameters, data: any): any {
  data.data = (getValue(data, step.first ?? "data") ?? "").concat(getValue(data, step.second ?? "data") ?? "");
  return data
}

function pushToArray(parameters: PushToArrayParameters, data: any): any {
  data[parameters.array].push(deepCopy(getValue(data, parameters.data ?? "data")))
  return data
}

async function forEachStep(stepParameters: ForEachParameters, data: any): Promise<any> {
  const source = data[stepParameters.source]
  try {
    for (const element of source) {
      data.data = element
      try {
        data = await stepsManager(deepCopy(stepParameters.steps), data)
      }
      catch (e) {
        console.log("foreach inner catch")
        console.log(e)
        console.log(data.data)
        continue
      }
    }
  } catch (e) {
    console.log("foreach outer catch")
    console.log(e)
    console.log(source)
  }
  return data
}

function setProp(stepParameters: SetPropParameters, data: any): any {
  let toSet = getValue(data, stepParameters.source ?? "data")
  return setValue(data, stepParameters.destination ?? "data", toSet)
}

function HTMLQuerySelector(stepParameters: HTMLQuerySelectorParameters, data: any): any {
  if (stepParameters.all) {
    data.data = (data.data as HTMLElement).querySelectorAll(data[stepParameters.selector])
  }
  else {
    data.data = (data.data as HTMLElement).querySelector(data[stepParameters.selector])
  }
  return data
}

function SplitStep(stepParameters: SplitParameters, data: any): any {
  data.data = data.data.split(stepParameters.separator, stepParameters.limit)
  return data
}

function ReplaceStep(stepParameters: ReplaceParameters, data: any): any {
  if (stepParameters.all) {
    data.data = data.data.replaceAll(stepParameters.searchValue, stepParameters.newValue)
  }
  else {
    data.data = data.data.replace(stepParameters.searchValue, stepParameters.newValue)
  }
  return data
}

function SpreadStep(stepParameters: SpreadParameters, data: any): any {
  data.data = {
    ...getValue(data, stepParameters.first ?? "data"),
    ...getValue(data, stepParameters.second ?? "data")
  }
  return data
}

async function IfStep(stepParameters: IfParameters, data: any): Promise<any> {
  const condition = stepParameters.data ? data[stepParameters.data] : data.data
  if (condition) {
    return await stepsManager(deepCopy(stepParameters.steps), data)
  }
  else if (stepParameters.elseSteps) {
    return await stepsManager(deepCopy(stepParameters.elseSteps), data)
  }
  return data
}

function getValue(obj: any, path: string): any {
  return path.split('.').reduce((o, key) => o?.[key], obj);
}

function setValue(obj: any, path: string, value: any): any {
  const keys = path.split(".");
  const last = keys.pop() as string;

  let curr = obj;
  for (const key of keys) {
    if (typeof curr[key] !== "object" || curr[key] === null) {
      curr[key] = {};
    }
    curr = curr[key];
  }

  curr[last] = value;

  return obj
}


