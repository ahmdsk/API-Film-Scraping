import * as cheerio from "cheerio";
import express, { Request, Response } from "express";
import { getHtmlData } from "./helper/html_parser";
import { IMovie } from "./interface/Movie";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/movies/:page?", async (req: Request, res: Response) => {
  let url = "https://ngefilm21.shop/";
  let $ = cheerio.load(await getHtmlData(url));

  const paginate = $(".pagination");
  let count_last_page: number = 0;

  // Setter variable count_last_page
  paginate.each((i, el) => {
    // Remove next page button
    $(el).find("a.next.page-numbers").remove();

    // Get last page number paginate
    count_last_page = parseInt($(el).find("a.page-numbers").last().text());
  });

  // Get page number from params
  const page = parseInt(req.params.page);
  page > 1
    ? page <= count_last_page && (url = `https://ngefilm21.shop/page/${page}/`)
    : url;

  console.log(`🐢 You now in url: ${url}`);
  $ = cheerio.load(await getHtmlData(url));

  const movies: IMovie[] = [];
  const container = $("article.item-infinite");
  container.each((i, el) => {
    movies.push({
      title: $(el).find("h2.entry-title a").text(),
      link: $(el).find("h2.entry-title a").attr("href"),
      thumbnail_url: $(el).find("img.attachment-medium").attr("src"),
      duration: $(el).find(".gmr-duration-item").text().trim(),
      rating: $(el).find(".gmr-rating-item").text().trim(),
      quality: $(el).find(".gmr-quality-item a").text() || "TV Show",
      episode: $(el).find(".gmr-numbeps").text(),
    });
  });

  res.status(200).json({
    data: movies,
  });
});

app.listen(port, () => {
  console.log(`🚀 App listening at http://localhost:${port}`);
});
