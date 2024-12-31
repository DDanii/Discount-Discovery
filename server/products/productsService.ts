import sourceData from '../../store/storeP.json'
import { product } from "./product";
import parse from 'node-html-parser'
import type { shopConfig } from '../../types/ShopConfig'

const shopConfigs = [] as shopConfig[]
const products = [] as product[]
export class ProductsService {


  /**
   *
   */
  constructor() {
    this.setup()

  }
  public list(): product[] {
    return []
  }




  private async getProducts(url: string, shopConfig: shopConfig) {
    const site = parse(await (await fetch(url)).text())
    site.querySelectorAll(shopConfig.product).forEach((productHTML) => {
      const img = parse(productHTML.toString()).querySelector(shopConfig.image)?.getAttribute('src')
      const name = parse(productHTML.toString()).querySelector(shopConfig.name)?.text

      products.push({ image: img, name: name })
    })
    return products
  }

  private setup() {
    shopConfigs.push(sourceData as shopConfig)
    shopConfigs.forEach(async (shopConfig) => {
      if (shopConfig.paginated) {
        let page = shopConfig.pagination_start_index
        let tmp_products = [] as product[]
        do {
          tmp_products = await this.getProducts(
            shopConfig.source.replace('{page}', String(page)),
            shopConfig,
          )
          products.concat(tmp_products)
          page++
        } while (tmp_products)
      }
    })
  }



}
