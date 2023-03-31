import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { getHtmlData } from "../helper/html_parser";
import removeSeparator from "../helper/remove_separator";
import { IContainerMovieData } from "../interface/ContainerMovieData";
import { DetailVote } from "../interface/DetailVote";
import { IDownloadLinks } from "../interface/DownloadLinks";
import { IMovie } from "../interface/Movie";
import { MovieData } from "../interface/MovieData";
import { MovieDetail } from "../interface/MovieDetail";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "../utils/Response";

export async function getAllMovies(req: Request, res: Response) {
  try {
    let url = "https://ngefilm21.club/";
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
      ? page <= count_last_page
        ? (url = `https://ngefilm21.club/page/${page}/`)
        : res.status(404).json(responseErrorWithMessage("Page Not Found"))
      : url;

    console.log(`🐢 You now in url: ${url}`);
    $ = cheerio.load(await getHtmlData(url));

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
        total_page: count_last_page,
        movies,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(responseErrorWithMessage());
  }
}

export async function getDetailMovie(req: Request, res: Response) {
  if (!req.params.slug) {
    return res.status(400).json(responseErrorWithMessage());
  }

  try {
    let slug = req.params.slug;
    let url = "https://ngefilm21.club/";
    let link = url + slug;

    let $ = cheerio.load(await getHtmlData(link));

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
        created_at: $(el).find("[itemprop='dateModified']").text(),
      });
    });

    let container_movie_data: IContainerMovieData = {
      Genre: undefined,
      Kualitas: undefined,
      Tahun: undefined,
      Durasi: undefined,
      Negara: undefined,
      Rilis: undefined,
      Bahasa: undefined,
      Direksi: undefined,
      Pemain: undefined,
      Tagline: undefined,
      Rating: undefined,
    };

    for (let i = 2; i < key_movie_data.length; i++) {
      if (key_movie_data[i] === "Genre") {
        container_movie_data.Genre = value_movie_data[i];
      } else if (key_movie_data[i] === "Kualitas") {
        container_movie_data.Kualitas = value_movie_data[i];
      } else if (key_movie_data[i] === "Tahun") {
        container_movie_data.Tahun = value_movie_data[i];
      } else if (key_movie_data[i] === "Durasi") {
        container_movie_data.Durasi = value_movie_data[i];
      } else if (key_movie_data[i] === "Negara") {
        container_movie_data.Negara = value_movie_data[i];
      } else if (key_movie_data[i] === "Rilis") {
        container_movie_data.Rilis = value_movie_data[i];
      } else if (key_movie_data[i] === "Bahasa") {
        container_movie_data.Bahasa = value_movie_data[i];
      } else if (key_movie_data[i] === "Direksi") {
        container_movie_data.Direksi = value_movie_data[i];
      } else if (key_movie_data[i] === "Pemain") {
        container_movie_data.Pemain = value_movie_data[i];
      } else if (key_movie_data[i] === "Tagline") {
        container_movie_data.Tagline = value_movie_data[i];
      } else if (key_movie_data[i] === "Rating") {
        container_movie_data.Rating = value_movie_data[i];
      }
    }

    // get stream links
    const stream_links = [];
    const num_of_stream_links = $("ul.muvipro-player-tabs li:last-child a")
      .text()
      .split(" ")
      .at(-1);
    if (num_of_stream_links) {
      for (let i = 1; i <= parseInt(num_of_stream_links); i++) {
        stream_links.push(url + slug + "/?player=" + i);
      }
    }

    const streaming_links = [];
    for (let i = 0; i < stream_links.length; i++) {
      const $ = cheerio.load(await getHtmlData(stream_links[i]));
      const stream_link = $(".gmr-embed-responsive iframe").attr("src");

      streaming_links.push(stream_link);
    }

    res.status(200).json(
      responseSuccessWithData({
        title: movie_data[0].title,
        thumbnail_url: movie_data[0].thumbnail_url,
        description: detail_movie[0].description,
        created_at: detail_movie[0].created_at,
        tagline: container_movie_data.Tagline ?? "",
        rating: container_movie_data.Rating ?? "",
        genre: container_movie_data.Genre ?? "",
        quality: container_movie_data.Kualitas ?? "",
        year: container_movie_data.Tahun ?? "",
        duration: container_movie_data.Durasi ?? "",
        country: container_movie_data.Negara ?? "",
        realease: container_movie_data.Rilis ?? "",
        language: container_movie_data.Bahasa ?? "",
        director: container_movie_data.Direksi ?? "",
        artist: container_movie_data.Pemain ?? "",
        voting: detail_voting[0],
        download_links,
        streaming_links,
      })
    );
  } catch (error) {
    console.log("🐢 Error getDetailMovie: ", error);
    res.status(500).json(responseErrorWithMessage());
  }
}
