import express, { NextFunction, Request, Response } from "express";

import cors from "cors"
import dotenv from "dotenv"
import router from "./src/router/route";
import { Config } from "./src/Config";
dotenv.config()

const app = express();

app.use(cors())
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Referrer-Policy", "no-referrer")
  res.setHeader("Referer", Config.filmURL)
  next();
})

app.use(router);

app.listen(Config.port, () => {
  console.log(`🚀 App listening at http://localhost:${Config.port}`);
});
