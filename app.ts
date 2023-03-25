import express, { Request, Response } from "express";
import { getAllMovies, getDetailMovie } from "./services/Movies";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/movies/:page?", getAllMovies);
app.get("/movies/detail/:slug", getDetailMovie);

app.listen(port, () => {
  console.log(`🚀 App listening at http://localhost:${port}`);
});
