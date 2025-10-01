/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse as HTMLParse } from "node-html-parser";
import { readdirSync, readFileSync } from "fs";
import { type ParseStep, stepType, type SetPropParameters,
  type ForEachParameters, type PushToArrayParameters, 
  type ConcatParameters, type SliceParameters, type SplitParameters,
  type ReplaceParameters, type FetchParameters, type SpreadParameters,
  type HTMLQuerySelectorParameters, type IfParameters, 
  type ShopConfig} from "../types/shopConfig";
import { parse as YamlParse } from "yaml";
import { shopConfigSchema } from "../validators/shopConfigSchema";
import prisma, { type Product, type Shop } from "../../lib/prisma";
import { CronJob } from "cron";

const cacheDateDifference = 43400000;
const defaultCron = "0 6 * * *";
const jobs = [] as CronJob[]

let year = (new Date()).getFullYear()
let month = (new Date()).getMonth()
let tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)

export class ProductsService {

  public async createUser(){
    await prisma.user.upsert({
      where: { id: 1 },
      create: { id: 1, name: "Admin", password: "dummy" },
      update: {}
    })
  }

  public async fetch() {
    const files = readdirSync('store')
    for (const fname of files) {
      if (fname.endsWith(".yml"))
        await handleConfigFile(fname)
    }
  }
}

async function handleConfigFile(fname: string){

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

    const shop = await prisma.shop.upsert({
      where: {source: fname},
      create: {source: fname, name: config.data.name},
      update: {source: fname, name: config.data.name}
    })
    
    const job = new CronJob(config.data.cron ?? defaultCron, async () => {
      await gatherProducts(config.data, shop)}, null, true //TODO handle timezone
    )
    const dates = job.nextDates(2)
    
    const diff = (dates[1]?.toMillis() ?? cacheDateDifference) - (dates[0]?.toMillis() ?? 0)
    if (!shop.lastUpdated || (new Date().getTime() - shop.lastUpdated.getTime()) > diff) {
      await gatherProducts(config.data, shop);
    }

    jobs.push(job)
  }
  catch (e) {
    console.log("Shop handle error")
    console.log(fname)
    console.log(e)
  }
}

async function gatherProducts(config: ShopConfig , shop: Shop) {
  let data = { DDParsedProducts: [], currentYear: year.toString() };
  year = (new Date()).getFullYear()
  month = (new Date()).getMonth()
  tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  data = await stepsManager(config.steps, data)
  
  data.DDParsedProducts.forEach(async (product: Product) => {
    await handleProduct(product, config, shop);
  });
  
  await prisma.shop.update({
    where: { id: shop.id },
    data: { lastUpdated: new Date() }
  })
}

async function handleProduct(product: Product, config: ShopConfig, shop: Shop) {
  product.startDate = product.startDate ? new Date(product.startDate) : new Date();
  product.endDate = product.endDate ? new Date(product.endDate) : tomorrow;
  if (config.autoCorrectYears) {
    correctYears(product);
  }
  await prisma.product.upsert({
    where: { shopId_externalId: { externalId: product.externalId, shopId: shop.id } },
    update: { ...product, shopId: shop.id },
    create: { ...product, shopId: shop.id }
  });
}

function correctYears(product: Product): Product {
  if (month == 11)
  {
    if (product.startDate.getMonth() == 0)
      product.startDate.setFullYear(year + 1)
    if (product.endDate.getMonth() == 0)
      product.endDate.setFullYear(year + 1)
  }
  else if (month == 0)
  {
    if (product.startDate.getMonth() == 11)
      product.startDate.setFullYear(year - 1)
    if (product.endDate.getMonth() == 11)
      product.endDate.setFullYear(year - 1)
  }
  return product
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

    case stepType.Literal:
      data[step.stepParameters.destination ?? "data"] = step.stepParameters.data
      break
    case stepType.Fetch:
      data = await FetchStep(step.stepParameters, data)
      break
    case stepType.SetProp:
      data = setProp(step.stepParameters, data)
      break
    case stepType.ParseJSON:
      data.data = JSON.parse(data.data)
      break
    case stepType.ForEach:
      data = await forEachStep(step.stepParameters, data)
      break
    case stepType.CreateArray:
      data[step.stepParameters.name] = []
      break
    case stepType.PushToArray:
      data = pushToArray(step.stepParameters, data)
      break
    case stepType.ParseHTML:
      data.data = HTMLParse(data.data);
      break;
    case stepType.HTMLQuerySelector:
      data = HTMLQuerySelector(step.stepParameters, data)
      break;
    case stepType.Concat:
      data = ConcatStep(step.stepParameters, data)
      break;
    case stepType.ToString:
      data.data = data.data.toString()
      break;
    case stepType.HTMLClone:
      data[step.stepParameters.destination] = data.data.clone()
      break;
    case stepType.DeepCopy:
      data.data = deepCopy(data.data)
      break;
    case stepType.Slice:
      data = SliceStep(step.stepParameters, data)
      break;
    case stepType.Split:
      data = SplitStep(step.stepParameters, data)
      break;
    case stepType.Replace:
      data = ReplaceStep(step.stepParameters, data)
      break;
    case stepType.Spread:
      data = SpreadStep(step.stepParameters, data)
      break;
    case stepType.If:
      data = await IfStep(step.stepParameters, data)
      break;
  }
  return data
}

async function FetchStep(parameters: FetchParameters, data: any): Promise<any> {
  console.log("fetching")
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
  data.data = await (await fetch(request)).text()
  return data;
}

function SliceStep(parameters: SliceParameters, data: any): any {
  data.data = data.data.slice(parameters.start, parameters.end)
  return data
}

function ConcatStep(step: ConcatParameters, data: any): any {
  data.data = (data[step.first ?? "data"] ?? "").concat(data[step.second ?? "data"] ?? "");
  return data
}

function pushToArray(parameters: PushToArrayParameters, data: any): any {
  data[parameters.array].push(deepCopy(data[parameters.data ?? "data"]))
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
  }catch(e) {
    console.log("foreach outer catch")
    console.log(e)
    console.log(source)
  }
  return data
}

function deepCopy(data: any): any {
  return JSON.parse(JSON.stringify(data))
}

function setProp(stepParameters: SetPropParameters, data: any): any {
  let toSet = data[stepParameters.source ?? "data"]
  if (stepParameters.sourceProp != undefined && toSet) {
    toSet = toSet[stepParameters.sourceProp]
  }
  const destination = stepParameters.destination ?? "data";
  if (!data[destination]) {
    data[destination] = {}
  }
  if (stepParameters.destinationProp) {
    data[destination][stepParameters.destinationProp] = toSet
  }
  else {
    data[destination] = toSet
  }
  return data
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
    ...data[stepParameters.first ?? "data"],
    ...data[stepParameters.second ?? "data"]
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

