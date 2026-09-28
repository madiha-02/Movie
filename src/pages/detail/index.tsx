import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Layout from "../../Layout";
import MovieStatus from "../../components/movie-status";
import TrailerModal from "../../components/trailer-modal";
import BookmarkIcon from "../../components/icons/bookmark-icon";
import BookmarkEmptyIcon from "../../components/icons/bookmark-empy-icon";
import { MovieContext } from "../../context/movie-context";
import { useTrailer } from "../../hooks/useTrailer";
import { MediaType, MovieDetails, TmdbConfigError, fetchDetails } from "../../services/tmdb";

const Detail = () => {
  const { mediaType, tmdbId } = useParams<{ mediaType: string; tmdbId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(MovieContext);
  const trailer = useTrailer();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = Number(tmdbId);
    if (!mediaType || (mediaType !== "movie" && mediaType !== "tv") || !Number.isFinite(id)) {
      setError("Invalid title.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchDetails(mediaType as MediaType, id)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof TmdbConfigError
            ? err.message
            : "Could not load this title from TMDB."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mediaType, tmdbId]);

  const isBookmarked = details ? Boolean(state.bookmarks[details.id]) : false;

  return (
    <Layout>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
        <IconButton
          aria-label="go back"
          onClick={() => navigate(-1)}
          sx={{ color: "text.primary", mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <MovieStatus loading={loading} error={error} />

        {!loading && !error && details && (
          <Box>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 220, md: 360 },
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              {details.backdropUrl && (
                <Box
                  component="img"
                  src={details.backdropUrl}
                  alt=""
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)",
                }}
              />
              <IconButton
                aria-label={`play ${details.title} trailer`}
                onClick={() => trailer.play(details.mediaType, details.tmdbId)}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                }}
              >
                <PlayArrowIcon fontSize="large" />
              </IconButton>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ mt: -6, px: { xs: 0, sm: 3 }, position: "relative" }}
            >
              <Box
                component="img"
                src={details.thumbnail.regular.medium}
                alt=""
                sx={{
                  width: 140,
                  height: 210,
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  flexShrink: 0,
                }}
              />

              <Box sx={{ pt: { xs: 1, sm: 7 }, flex: 1 }}>
                <Stack
                  direction="row"
                  sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
                    {details.title}
                  </Typography>
                  <Box
                    sx={{
                      p: "0.75rem",
                      backgroundColor: "black",
                      borderRadius: "100%",
                      cursor: "pointer",
                      flexShrink: 0,
                      "&:hover": { opacity: 0.8 },
                    }}
                    onClick={() => dispatch({ type: "TOGGLE_BOOKMARK", movie: details })}
                  >
                    {isBookmarked ? (
                      <BookmarkIcon fill={"#E0E0E0"} />
                    ) : (
                      <BookmarkEmptyIcon />
                    )}
                  </Box>
                </Stack>

                <Typography sx={{ color: "text.secondary", mb: 2 }}>
                  {details.year || "N/A"} • {details.category} •{" "}
                  <Box component="span" sx={{ color: "secondary.main", fontWeight: 600 }}>
                    ★ {details.rating}
                  </Box>
                  {details.runtimeMinutes ? ` • ${details.runtimeMinutes} min` : ""}
                  {details.numberOfSeasons
                    ? ` • ${details.numberOfSeasons} season${details.numberOfSeasons > 1 ? "s" : ""}`
                    : ""}
                </Typography>

                {details.genres.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
                    {details.genres.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="small"
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
                          color: "primary.main",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                )}

                <Typography sx={{ color: "text.secondary", maxWidth: 720 }}>
                  {details.overview}
                </Typography>
              </Box>
            </Stack>

            {details.cast.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                  Cast
                </Typography>
                <Stack direction="row" spacing={3} sx={{ overflowX: "auto", pb: 1 }}>
                  {details.cast.map((member) => (
                    <Stack key={member.id} spacing={1} sx={{ alignItems: "center", minWidth: 90 }}>
                      <Avatar
                        src={member.profileUrl || undefined}
                        alt={member.name}
                        sx={{ width: 72, height: 72 }}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontSize: 12, textAlign: "center" }}>
                        {member.name}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "text.secondary", textAlign: "center" }}>
                        {member.character}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {details && (
        <TrailerModal
          open={trailer.open}
          onClose={trailer.close}
          videoKey={trailer.videoKey}
          loading={trailer.loading}
          error={trailer.error}
          title={details.title}
        />
      )}
    </Layout>
  );
};

export default Detail;
