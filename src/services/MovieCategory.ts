import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { getHtmlData } from "../helper/html_parser";
import { responseSuccessWithData } from "../utils/Response";

export async function MovieCategory(req: Request, res: Response) {
  const url = "https://ngefilm21.shop";
  const $ = cheerio.load(await getHtmlData(url));

  const categories: any[] = [];
  $(".menu-item-object-category.menu-item-has-children").each((i, el) => {
    $(el)
      .find("a")
      .each((i, el) => {
        let link = $(el).attr("href") as string;

        categories.push({
          title: $(el).text(),
          link,
          slug: link.replace(`${url}/Genre/`, "").replace(/\/$/g, "")
        });
      });
  });

  res.status(200).json(responseSuccessWithData(categories));
}
