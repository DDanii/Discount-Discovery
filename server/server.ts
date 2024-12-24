import sourceData from '../dist/storeP.json'
import express from 'express'
import type { shopConfig } from '../types/ShopConfig'
import type { product } from '../types/product'


const shopConfigs = [] as shopConfig[]
const products = [] as product[]
const app = express()
const port = 3000

app.use(express.static('dist'))

app.get('/products', (req, res) => {
  res.json(products)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


async function getProducts(url, shopConfig) {
  const products = [] as product[]
  const site = document.implementation.createHTMLDocument('site')
  site.documentElement.innerHTML = await (await fetch(url)).text()
  let productNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productNode = site.evaluate(shopConfig.product, site.body).iterateNext() as any
  const resultProduct = {} as product
  while (productNode) {
    const productHTML = document.implementation.createHTMLDocument('product')
    productHTML.documentElement.innerHTML = productNode.innerHTML
    resultProduct.image = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productHTML.evaluate(shopConfig.image, productHTML.body).iterateNext() as any
    ).src
    resultProduct.name = productHTML.evaluate(shopConfig.name, productHTML.body).stringValue
    productNode = site.evaluate(shopConfig.product, site.body).iterateNext()
  }
  products.concat(resultProduct)
  return products
}

function setup(){
  shopConfigs.push(sourceData as shopConfig)
  shopConfigs.forEach(async (shopConfig) => {
    if (shopConfig.paginated) {
      let page = shopConfig.pagination_start_index
      let tmp_products = [] as product[]
      do {
        tmp_products = await getProducts(
          shopConfig.source.replace('{page}', String(page)),
          shopConfig,
        )
        products.concat(tmp_products)
        page++
      } while (tmp_products)
    }
  })
}

setup()
