import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { getHtmlData } from "../helper/html_parser";
import { IMovie } from "../interface/Movie";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "../utils/Response";

export async function SearchMovie(req: Request, res: Response) {
  try {
    let url = "https://ngefilm21.club/?s=";
    let params = req.query.s as string;
    params = params.toLowerCase().replace(/ /g, "+");
    params += "&post_type[]=post&post_type[]=tv";

    if (req.query.page != undefined) {
      url = "https://ngefilm21.club/page/" + req.query.page + "/?s=";
    }

    const full_url = url + params;
    const $ = cheerio.load(await getHtmlData(full_url));

    let max_page = 0;
    $(".pagination").each((i, el) => {
      $(el).find("a.next.page-numbers").remove();
      max_page = parseInt($(el).find("a.page-numbers").last().text());
    });

    const movies: IMovie[] = [];
    const container = $("article.item-infinite");
    container.each((i, el) => {
      let link = $(el).find("h2.entry-title a").attr("href");

      movies.push({
        title: $(el).find("h2.entry-title a").text(),
        slug: link?.replace(/^https:\/\/ngefilm21\.club/, "").replace(/tv\//g, "").replace(/\//g, ""),
        thumbnail_url: $(el).find("img.attachment-medium").attr("src"),
        duration: $(el).find(".gmr-duration-item").text().trim(),
        rating: $(el).find(".gmr-rating-item").text().trim(),
        quality: $(el).find(".gmr-quality-item a").text() || "TV Show",
        episode: $(el).find(".gmr-numbeps").text(),
        link,
      });
    });

    res.status(200).json(
      responseSuccessWithData({
        total_page: max_page,
        movies,
      })
    );
  } catch (error) {
    res.status(500).json(responseErrorWithMessage());
  }
}
