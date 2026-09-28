import { ReactNode, createContext, useEffect, useReducer } from "react";
import { MovieDataType } from "../assets/data";
import {
  TmdbConfigError,
  fetchPopular,
  fetchTrending,
} from "../services/tmdb";

interface MovieContextProps {
  children: ReactNode;
}

interface MovieState {
  movies: MovieDataType[];
  bookmarks: Record<string, MovieDataType>;
  loading: boolean;
  error: string | null;
}

type MovieAction =
  | { type: "TOGGLE_BOOKMARK"; movie: MovieDataType }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; movies: MovieDataType[] }
  | { type: "FETCH_ERROR"; error: string };

const BOOKMARKS_KEY = "movie-app:bookmarks";

const isMovieDataType = (value: unknown): value is MovieDataType =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as MovieDataType).id === "string" &&
  typeof (value as MovieDataType).thumbnail === "object";

const loadBookmarks = (): Record<string, MovieDataType> => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) || typeof parsed !== "object" || parsed === null) {
      return {};
    }
    const entries = Object.entries(parsed as Record<string, unknown>).filter(
      ([, value]) => isMovieDataType(value)
    ) as [string, MovieDataType][];
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
};

const saveBookmarks = (bookmarks: Record<string, MovieDataType>) => {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // localStorage unavailable (private mode, etc.) - bookmarks just won't persist
  }
};

const initialMovieState: MovieState = {
  movies: [],
  bookmarks: loadBookmarks(),
  loading: true,
  error: null,
};

const MovieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, movies: action.movies };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
    case "TOGGLE_BOOKMARK": {
      const bookmarks = { ...state.bookmarks };
      if (bookmarks[action.movie.id]) {
        delete bookmarks[action.movie.id];
      } else {
        bookmarks[action.movie.id] = action.movie;
      }
      saveBookmarks(bookmarks);
      return { ...state, bookmarks };
    }
    default:
      return state;
  }
};

export const MovieContext = createContext<{
  state: MovieState;
  dispatch: React.Dispatch<MovieAction>;
}>({
  state: initialMovieState,
  dispatch: () => {},
});

export const MovieProvider = ({ children }: MovieContextProps) => {
  const [state, dispatch] = useReducer(MovieReducer, initialMovieState);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const [trending, popularMovies, popularTv] = await Promise.all([
          fetchTrending(),
          fetchPopular("movie"),
          fetchPopular("tv"),
        ]);

        const byId = new Map<string, MovieDataType>();
        [...trending, ...popularMovies, ...popularTv].forEach((movie) => {
          if (!byId.has(movie.id)) byId.set(movie.id, movie);
        });

        if (!cancelled) {
          dispatch({ type: "FETCH_SUCCESS", movies: Array.from(byId.values()) });
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof TmdbConfigError
            ? err.message
            : "Could not load movies from TMDB. Check your connection and try again.";
        dispatch({ type: "FETCH_ERROR", error: message });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};
