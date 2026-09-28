import { useEffect, useState } from "react";
import { MediaType, MovieDataType, searchMulti } from "../services/tmdb";

export const useMovieSearch = (mediaTypeFilter?: MediaType) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieDataType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const data = await searchMulti(query);
        if (cancelled) return;
        setResults(
          mediaTypeFilter ? data.filter((m) => m.mediaType === mediaTypeFilter) : data
        );
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, mediaTypeFilter]);

  return { query, setQuery, results, loading };
};
