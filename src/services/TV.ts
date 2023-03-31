import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { getHtmlData } from "../helper/html_parser";
import removeSeparator from "../helper/remove_separator";
import { IContainerTVData } from "../interface/ContainerTVData";
import { DetailVote } from "../interface/DetailVote";
import { IDownloadLinks } from "../interface/DownloadLinks";
import { MovieData } from "../interface/MovieData";
import { MovieDetail } from "../interface/MovieDetail";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "../utils/Response";

export async function getDetailTV(req: Request, res: Response) {
  if (!req.params.slug) {
    return res.status(400).json(responseErrorWithMessage());
  }

  try {
    let slug = req.params.slug;
    let url = "https://ngefilm21.club/";
    let link = url + slug;

    let $ = cheerio.load(await getHtmlData(link));

    const movie_data: MovieData[] = [];
    const detail_voting: DetailVote[] = [];

    const gmr_movie_data = $(".gmr-movie-data");
    gmr_movie_data.each((i, el) => {
      const meta_rating = $(el).find(".gmr-meta-rating");
      meta_rating.each((i, el) => {
        detail_voting.push({
          count: $(el).find("[itemprop='ratingCount']").text(),
          value: $(el).find("[itemprop='ratingValue']").text(),
        });
      });

      movie_data.push({
        title: $(el).find("h1.entry-title").text(),
        thumbnail_url: $(el).find("img.attachment-thumbnail").attr("src"),
      });
    });

    const detail_movie: MovieDetail[] = [];
    const content = $(".entry-content");

    let key_movie_data: (string | number)[] = [];
    let value_movie_data: any[] = [];

    content.each((i, el) => {
      $(el)
        .find(".gmr-moviedata")
        .each((i, el) => {
          const textLine = removeSeparator($(el).text())[0];
          const textValue = removeSeparator($(el).text())[1];

          key_movie_data.push(textLine);
          value_movie_data.push(textValue);
        });

      detail_movie.push({
        description: $(el).find("p").text(),
        created_at: $(el).find("[itemprop='datePublished']").text(),
      });
    });

    let container_movie_data: IContainerTVData = {
      Genre: undefined,
      Tahun: undefined,
      Negara: undefined,
      Rilis: undefined,
      Episode: undefined,
      Jaringan: undefined,
      Direksi: undefined,
      Pemain: undefined,
    };

    for (let i = 2; i < key_movie_data.length; i++) {
      if (key_movie_data[i] === "Genre") {
        container_movie_data.Genre = value_movie_data[i];
      } else if (key_movie_data[i] === "Tahun") {
        container_movie_data.Tahun = value_movie_data[i];
      } else if (key_movie_data[i] === "Negara") {
        container_movie_data.Negara = value_movie_data[i];
      } else if (key_movie_data[i] === "Rilis") {
        container_movie_data.Rilis = value_movie_data[i];
      } else if (key_movie_data[i] === "Jumlah Episode") {
        container_movie_data.Episode = value_movie_data[i];
      } else if (key_movie_data[i] === "Jaringan") {
        container_movie_data.Jaringan = value_movie_data[i];
      } else if (key_movie_data[i] === "Pemain") {
        container_movie_data.Pemain = value_movie_data[i];
      } else if (key_movie_data[i] === "Direksi") {
        container_movie_data.Direksi = value_movie_data[i];
      }
    }

    // get stream links
    const streaming_links: any[] = [];

    $(".gmr-listseries a").each((i, el) => {
      if (i !== 0) {
        let link = $(el).attr("href");
        streaming_links.push({
          link,
          slug: link?.replace(/^https:\/\/ngefilm21\.club/, "").replace(/eps\//g, "").replace(/\//g, ""),
        });
      }
    });

    res.status(200).json(
      responseSuccessWithData({
        title: movie_data[0].title,
        thumbnail_url: movie_data[0].thumbnail_url,
        description: detail_movie[0].description,
        created_at: detail_movie[0].created_at,
        genre: container_movie_data.Genre ?? "",
        year: container_movie_data.Tahun ?? "",
        country: container_movie_data.Negara ?? "",
        num_episode: container_movie_data.Episode ?? "",
        realease: container_movie_data.Rilis ?? "",
        network: container_movie_data.Jaringan ?? "",
        director: container_movie_data.Direksi ?? "",
        artist: container_movie_data.Pemain ?? "",
        streaming_links,
      })
    );
  } catch (error) {
    console.log("🐢 Error getDetailTV: ", error);
    res.status(500).json(responseErrorWithMessage());
  }
}

export async function getDetailEpisodeTV(req: Request, res: Response) {
  if (!req.params.slug) {
    return res.status(400).json(responseErrorWithMessage());
  }

  try {
    let slug = req.params.slug;
    let url = "https://ngefilm21.club/eps/";
    let link = url + slug;

    let $ = cheerio.load(await getHtmlData(link));

    // get stream links
    const stream_links = [];
    const num_of_stream_links = $("ul.muvipro-player-tabs li:last-child a")
      .text()
      .split(" ")
      .at(-1);
    if (num_of_stream_links) {
      for (let i = 2; i <= parseInt(num_of_stream_links); i++) {
        stream_links.push(url + slug + "/?player=" + i);
      }
    }

    const streaming_links = [];
    for (let i = 0; i < stream_links.length; i++) {
      const $ = cheerio.load(await getHtmlData(stream_links[i]));
      const stream_link = $(".gmr-embed-responsive iframe").attr("src");

      streaming_links.push(stream_link);
    }

    // Get Download Link
    const download = $("#download");
    const download_links: IDownloadLinks[] = [];
    download.each((i, el) => {
      $(el)
        .find("a.button.button-shadow")
        .each((i, el) => {
          download_links.push({
            link: $(el).attr("href"),
            text: $(el).text(),
          });
        });
    });

    res.status(200).json(
      responseSuccessWithData({
        title: $("h1.entry-title").text(),
        streaming_links,
        download_links,
      })
    );
  } catch (error) {
    console.log("🐢 Error getDetailEpisodeTV: ", error);
    res.status(500).json(responseErrorWithMessage());
  }
}
