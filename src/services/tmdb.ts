export type MediaType = "movie" | "tv";

export interface MovieDataType {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  thumbnail: {
    trending?: {
      small: string;
      large: string;
    };
    regular: {
      small: string;
      medium: string;
      large: string;
    };
  };
  year: number;
  category: "Movie" | "TV Series";
  rating: string;
  isTrending: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string;
}

export interface MovieDetails extends MovieDataType {
  overview: string;
  genres: string[];
  backdropUrl: string;
  runtimeMinutes: number | null;
  numberOfSeasons: number | null;
  cast: CastMember[];
  trailerKey: string | null;
}

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export class TmdbConfigError extends Error {}

interface TmdbRawResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type?: string;
}

interface TmdbListResponse {
  results: TmdbRawResult[];
}

interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  official?: boolean;
}

interface TmdbVideosResponse {
  results: TmdbVideo[];
}

interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TmdbDetailsResponse extends TmdbRawResult {
  overview: string;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  credits?: { cast: TmdbCastMember[] };
  videos?: TmdbVideosResponse;
}

const posterUrl = (path: string | null, size: string) =>
  path ? `${IMAGE_BASE}/${size}${path}` : "";

const toMovieData = (
  raw: TmdbRawResult,
  mediaType: MediaType,
  isTrending: boolean
): MovieDataType => {
  const year = Number(
    (mediaType === "movie" ? raw.release_date : raw.first_air_date)?.slice(
      0,
      4
    )
  );
  const regular = {
    small: posterUrl(raw.poster_path, "w185"),
    medium: posterUrl(raw.poster_path, "w342"),
    large: posterUrl(raw.poster_path, "w500"),
  };
  return {
    id: `${mediaType}-${raw.id}`,
    tmdbId: raw.id,
    mediaType,
    title: (mediaType === "movie" ? raw.title : raw.name) || "Untitled",
    thumbnail: {
      regular,
      ...(isTrending ? { trending: { small: regular.small, large: regular.large } } : {}),
    },
    year: Number.isFinite(year) ? year : 0,
    category: mediaType === "movie" ? "Movie" : "TV Series",
    rating: raw.vote_average ? raw.vote_average.toFixed(1) : "N/A",
    isTrending,
  };
};

const pickTrailerKey = (videos: TmdbVideo[]): string | null => {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const trailer =
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser");
  return trailer?.key ?? null;
};

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new TmdbConfigError(
      "Missing TMDB API key. Add REACT_APP_TMDB_API_KEY to your .env file (get one free at https://www.themoviedb.org/settings/api) and restart the dev server."
    );
  }
  const query = new URLSearchParams({ api_key: API_KEY, ...params });
  const res = await fetch(`${BASE_URL}${path}?${query.toString()}`);
  if (!res.ok) {
    if (res.status === 401) {
      throw new TmdbConfigError("TMDB rejected the API key. Double-check REACT_APP_TMDB_API_KEY.");
    }
    throw new Error(`TMDB request failed (${res.status}) for ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTrending(): Promise<MovieDataType[]> {
  const data = await tmdbFetch<TmdbListResponse>("/trending/all/week");
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => toMovieData(item, item.media_type as MediaType, true));
}

export async function fetchPopular(
  mediaType: MediaType,
  pages: number = 2
): Promise<MovieDataType[]> {
  const pageResults = await Promise.all(
    Array.from({ length: pages }, (_, i) =>
      tmdbFetch<TmdbListResponse>(`/${mediaType}/popular`, { page: String(i + 1) })
    )
  );
  return pageResults
    .flatMap((page) => page.results)
    .map((item) => toMovieData(item, mediaType, false));
}

export async function searchMulti(query: string): Promise<MovieDataType[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<TmdbListResponse>("/search/multi", { query });
  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => toMovieData(item, item.media_type as MediaType, false));
}

export async function fetchTrailerKey(
  mediaType: MediaType,
  tmdbId: number
): Promise<string | null> {
  const data = await tmdbFetch<TmdbVideosResponse>(`/${mediaType}/${tmdbId}/videos`);
  return pickTrailerKey(data.results);
}

export async function fetchDetails(
  mediaType: MediaType,
  tmdbId: number
): Promise<MovieDetails> {
  const raw = await tmdbFetch<TmdbDetailsResponse>(
    `/${mediaType}/${tmdbId}`,
    { append_to_response: "credits,videos" }
  );
  const base = toMovieData(raw, mediaType, false);
  return {
    ...base,
    overview: raw.overview || "No overview available.",
    genres: raw.genres.map((g) => g.name),
    backdropUrl: posterUrl(raw.backdrop_path, "w1280"),
    runtimeMinutes: mediaType === "movie" ? raw.runtime ?? null : null,
    numberOfSeasons: mediaType === "tv" ? raw.number_of_seasons ?? null : null,
    cast: (raw.credits?.cast ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .slice(0, 8)
      .map((member) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profileUrl: posterUrl(member.profile_path, "w185"),
      })),
    trailerKey: pickTrailerKey(raw.videos?.results ?? []),
  };
}
