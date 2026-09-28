import { useState } from "react";
import { MediaType, fetchTrailerKey } from "../services/tmdb";

export const useTrailer = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const play = async (mediaType: MediaType, tmdbId: number) => {
    setOpen(true);
    setLoading(true);
    setError(null);
    setVideoKey(null);
    try {
      const key = await fetchTrailerKey(mediaType, tmdbId);
      setVideoKey(key);
      if (!key) setError("No trailer available for this title.");
    } catch {
      setError("Could not load the trailer.");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setOpen(false);
    setVideoKey(null);
    setError(null);
  };

  return { open, loading, videoKey, error, play, close };
};
