import { exec } from "child_process";
import { ProductsService } from "~/utils/services/productsService";

export default defineNitroPlugin(async () => {
  await exec('npx prisma migrate deploy', {
    env: process.env   // Pass env vars
  },(error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }else{
    const productsService = new ProductsService()
      productsService.createUser()
      productsService.fetch()
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});  
});