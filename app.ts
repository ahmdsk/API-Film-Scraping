import express, { Request, Response } from "express";
import { getAllMovies, getDetailMovie } from "./src/services/Movies";
import { getDetailTV, getDetailEpisodeTV } from "./src/services/TV";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/movies/:page?", getAllMovies);
app.get("/movies/detail/:slug", getDetailMovie);

app.get("/tv/:slug", getDetailTV);
app.get("/tv/eps/:slug", getDetailEpisodeTV);

app.listen(port, () => {
  console.log(`🚀 App listening at http://localhost:${port}`);
});
