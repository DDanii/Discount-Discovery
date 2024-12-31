
import { RegisterRoutes } from "../build/routes";
import express, {json, urlencoded} from "express";
const app = express()


const port = 3000

app.use(express.static('dist'))

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

