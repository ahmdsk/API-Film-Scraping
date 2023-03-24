import * as cheerio from "cheerio";
import express, { Request, Response } from "express";
import { getHtmlData } from "./helper/html_parser";
import { IMovie } from "./interface/Movie";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/movies", async (req: Request, res: Response) => {
  const url = "https://ngefilm21.shop/";
  const $ = cheerio.load(await getHtmlData(url));

  const movies: IMovie[] = [];
  const container = $("article.item-infinite");
  container.each((i, el) => {
    movies.push({
      title: $(el).find("h2.entry-title a").text(),
      // link: $(el).find("h2.entry-title a").attr("href"),
      // thumbnail_url: $(el).find("img.attachment-medium").attr("src"),
      // duration: $(el).find(".gmr-duration-item").text().trim(),
      // rating: $(el).find(".gmr-rating-item").text().trim(),
      // quality: $(el).find(".gmr-quality-item a").text() || "TV Show",
      // episode: $(el).find(".gmr-numbeps").text()
    });
  });

  const paginate = $(".pagination").find("a.page-numbers");
  paginate.each((i, el) => {
    if(i == 2) {
      console.log($(el).text())
    }
  });

  res.status(200).json({
    data: movies,
  });
});

app.listen(port, () => {
  console.log(`🚀 App listening at http://localhost:${port}`);
});
