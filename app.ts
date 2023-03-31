import express, { NextFunction, Request, Response } from "express";
import { getAllMovies, getDetailMovie } from "./src/services/Movies";
import { getDetailTV, getDetailEpisodeTV } from "./src/services/TV";
import { responseSuccessWithMessage } from "./src/utils/Response";

import cors from "cors"
import dotenv from "dotenv"
import { SearchMovie } from "./src/services/SearchMovie";
dotenv.config()

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Referrer-Policy", "no-referrer")
  res.setHeader("Referer", "https://ngefilm21.shop/")
  next();
})

app.get("/", (req: Request, res: Response) => {
  res.status(200).json(responseSuccessWithMessage("Welcome to API, please read the documentation for more information about this API in this https://github.com/ahmdsk/API-Film-Scraping. Thank you!"));
});

app.get("/movies/:page?", getAllMovies);
app.get("/movies/detail/:slug", getDetailMovie);

app.get("/tv/:slug", getDetailTV);
app.get("/tv/eps/:slug", getDetailEpisodeTV);

app.get("/search", SearchMovie);

app.listen(port, () => {
  console.log(`🚀 App listening at http://localhost:${port}`);
});
