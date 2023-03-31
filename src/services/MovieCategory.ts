import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { getHtmlData } from "../helper/html_parser";
import { IMovie } from "../interface/Movie";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "../utils/Response";

export async function MovieCategory(req: Request, res: Response) {
  const url = "https://ngefilm21.club";
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
          slug: link.split("/").at(-2),
        });
      });
  });

  res.status(200).json(responseSuccessWithData(categories));
}

export async function MovieCategoryList(req: Request, res: Response) {
  try {
    const url = req.query.url as string;
    const $ = cheerio.load(await getHtmlData(url));

    let max_page = 0;
    $(".pagination").each((i, el) => {
      $(el).find("a.next.page-numbers").remove();
      max_page = parseInt($(el).find("a.page-numbers").last().text());
    });

    const movies: IMovie[] = [];
    $("#gmr-main-load").each((i, el) => {
      $(el)
        .find(".item-infinite")
        .each((i, el) => {
          let link = $(el).find("h2.entry-title a").attr("href");
          link = link
            ?.replace(/https:\/\/ngefilm21.club\//g, "")
            .replace(/\/$/g, "")
            .replace("tv/", "");
          let quality: string = $(el).find(".gmr-quality-item").text();

          movies.push({
            title: $(el).find("h2.entry-title a").text(),
            link: link,
            thumbnail_url: $(el).find("img.attachment-medium").attr("src"),
            duration: $(el)
              .find("[property='duration']")
              .text()
              .replace(" ", ""),
            rating: $(el).find(".gmr-rating-item").text().replace(" ", ""),
            quality: quality == "" ? "TV Show" : quality,
            episode: $(el).find(".gmr-numbeps").text(),
          });
        });
    });

    res.status(200).json(
      responseSuccessWithData({
        total_page: max_page,
        movies,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(responseErrorWithMessage());
  }
}
