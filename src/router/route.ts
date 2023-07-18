import { Request, Response, Router } from "express";
import { getAllMovies, getDetailMovie } from "../services/Movies";
import { getDetailEpisodeTV, getDetailTV } from "../services/TV";
import { SearchMovie } from "../services/SearchMovie";
import { MovieCategory, MovieCategoryList } from "../services/MovieCategory";
import { responseSuccessWithMessage } from "../utils/Response";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      responseSuccessWithMessage(
        "Welcome to API, please read the documentation for more information about this API in this https://github.com/ahmdsk/API-Film-Scraping. Thank you!"
      )
    );
});

router.get("/movies/:page?", getAllMovies);
router.get("/movies/detail/:slug", getDetailMovie);

router.get("/tv/:slug", getDetailTV);
router.get("/tv/eps/:slug", getDetailEpisodeTV);

router.get("/search", SearchMovie);

router.get("/category", MovieCategory);
router.get("/detailcategory", MovieCategoryList);

export default router;
