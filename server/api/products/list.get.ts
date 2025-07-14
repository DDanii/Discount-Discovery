import { ProductsService } from "~/utils/services/productsService";

const productsService = new ProductsService()
export default defineEventHandler(async () => {
  return { productList: productsService.list() }
})