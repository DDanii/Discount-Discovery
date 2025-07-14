/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse as HTMLParse } from "node-html-parser";
import type { product } from "../types/product";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";
import { type ParseStep, stepType, type SetPropParameters, type ForEachParameters, type PushToArrayParameters, type HTMLQuerySelectorParameters, type ParallelProcessParameters, type ConcatParameters, type SliceParameters, type SplitParameters, type ReplaceParameters, type FetchParameters, type SpreadParameters } from "../types/shopConfig";
import { parse as YamlParse } from "yaml";
import { shopConfigSchema } from "../validators/shopConfigSchema";
import filenamifyUrl from "filenamify-url";

const fetchCache = "fetch_cache"

let products = [] as product[];

export class ProductsService {
  /**
   *
   */
  constructor() {
    mkdirSync(fetchCache, { recursive: true })
    const cacheFiles = readdirSync(fetchCache, { recursive: false })
    const now = (new Date()).getTime()
    for (const fname of cacheFiles) {
      const fpath = fetchCache + "/" + fname
      const dif = Math.abs(statSync(fpath).mtime.getTime() - now)
      if (dif > 43400000)
        rmSync(fpath)
    }

    const files = readdirSync('store')
    for (const fname of files) {
      if (fname.endsWith(".yml"))
        handleConfigFile(fname)
    }
  }

  public list(): product[] {
    return products;
  }
}

function handleConfigFile(fname: string){
  try {

    const file = readFileSync('store/' + fname, 'utf8')
    const raw = YamlParse(file)
    const config = shopConfigSchema.safeParse(raw)

    if (!config.success) {
      console.log("Parse error")
      console.log(fname)
      console.log(config.error)
      return 
    }

    const data = { DDParsedProducts: [] }
    stepsManager(config.data.steps, data).then((data) => {
      products = products.concat(data.DDParsedProducts)
    })
  }
  catch (e) {
    console.log("Shop handle error")
    console.log(fname)
    console.log(e)
  }
}

async function stepsManager(steps: ParseStep[], data: any): Promise<any> {
  if (!steps) {
    return data
  }

  while (steps.length > 0) {
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
    case stepType.ParallelProcess:
      data = await ParallelProcess(step.stepParameters, data)
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
  }
  return data
}

async function FetchStep(parameters: FetchParameters, data: any): Promise<any> {
  const cachefile = fetchCache + "/" + filenamifyUrl(data.data)
  if (existsSync(cachefile)) {
    data.data = readFileSync(cachefile)
    return data
  }
  const request = new Request(data.data)
  if (parameters.headersSource) {
    for (const header of data[parameters.headersSource]) {
      request.headers.set(Object.keys(header)[0], Object.values<string>(header)[0])
    }
  }
  data.data = await (await fetch(request)).text()
  writeFileSync(cachefile, data.data)
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
  data[parameters.array].push(deepCopy(data[parameters.data]))
  return data
}

async function forEachStep(stepParameters: ForEachParameters, data: any): Promise<any> {
  const source = data[stepParameters.source]
  for (const element of source) {
    data.data = element
    try {
      data = await stepsManager(deepCopy(stepParameters.steps), data)
    }
    catch (e) {
      console.log("foreach catch")
      console.log(e)
      console.log(data.data)
      continue
    }
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

async function ParallelProcess(stepParameters: ParallelProcessParameters, data: any): Promise<any> {
  const results = [] as any[]

  for (const step of stepParameters.steps) {
    results.push(await stepResolver(step, deepCopy(data)))
  }
  for (const result of results) {
    data = { ...data, ...result }
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
  data.data = { ...data[stepParameters.first ?? "data"], ...data[stepParameters.second ?? "data"] }
  return data
}

