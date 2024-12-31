import { Controller, Get, Route } from "tsoa";
import { product } from "./product";
import { ProductsService } from "./productsService";

let productsService: ProductsService
@Route("products")
export class ProductsController extends Controller {
  /**
   *
   */
  constructor() {
    super()
    productsService = new ProductsService()

  }
  @Get("")
  public async getProducts(): Promise<product[]> {
    return productsService.list()
  }
}
