import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error";
import Movie from "./pages/movie";
import TvSeries from "./pages/tv-series";
import Bookmark from "./pages/bookmark";
import Splash from "./pages/splash";
import Detail from "./pages/detail";

export const router = createBrowserRouter([
 
  {
    path: "/",
    element: <Splash />,
    errorElement: <Error />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/movies",
    element: <Movie />,
    errorElement: <Error />,
  },
  {
    path: "/tv-series",
    element: <TvSeries />,
    errorElement: <Error />,
  },
  {
    path: "/bookmarks",
    element: <Bookmark />,
    errorElement: <Error />,
  },
  {
    path: "/title/:mediaType/:tmdbId",
    element: <Detail />,
    errorElement: <Error />,
  },
]);
