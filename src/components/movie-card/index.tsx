import { MouseEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MovieDataType } from "../../assets/data";
import { MovieContext } from "../../context/movie-context";
import { Box, Card, CardContent, IconButton, Stack, Typography, Grid } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import moviesIcon from "../../assets/icons/icon-category-movie.svg";
import tvSeriesIcon from "../../assets/icons/icon-category-tv.svg";
import BookmarkIcon from "../icons/bookmark-icon";
import BookmarkEmptyIcon from "../icons/bookmark-empy-icon";
import TrailerModal from "../trailer-modal";
import { useTrailer } from "../../hooks/useTrailer";

interface MovieCardProps {
  movie: MovieDataType;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { state, dispatch } = useContext(MovieContext);
  const trailer = useTrailer();
  const navigate = useNavigate();
  const isBookmarked = Boolean(state.bookmarks[movie.id]);

  const handleToggleBookmark = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_BOOKMARK", movie });
  };

  const handlePlayTrailer = (e: MouseEvent) => {
    e.stopPropagation();
    trailer.play(movie.mediaType, movie.tmdbId);
  };

  const handleOpenDetails = () => {
    navigate(`/title/${movie.mediaType}/${movie.tmdbId}`);
  };

  return (
    <Card
      elevation={0}
      sx={{ bgcolor: "transparent", color: "#E0E0E0", my: 1 }}
    >
      <CardContent sx={{ p: 0, position: "relative" }}>
        <Box
          onClick={handleOpenDetails}
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "2 / 3",
            cursor: "pointer",
          }}
        >
          <Box
            component="img"
            src={movie.thumbnail.regular.large}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              display: "block",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.6)",
              borderRadius: "8px",
            }}
          />
          <IconButton
            aria-label={`play ${movie.title} trailer`}
            onClick={handlePlayTrailer}
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
          <Stack
            spacing={0}
            sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2 }}
          >
            <Grid container spacing={1} sx={{ alignItems: "center" }}>
              <Grid>
                <Typography
                  sx={{ fontSize: 10, color: "#E0E0E0" }}
                  aria-label="year of movie"
                >
                  {movie.year}
                </Typography>
              </Grid>
              <Grid>
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    background: "#BDBDBD",
                    borderRadius: "50%",
                  }}
                />
              </Grid>
              <Grid>
                <img
                  src={movie.category === "Movie" ? moviesIcon : tvSeriesIcon}
                  alt=""
                  width={16}
                  height={16}
                />
              </Grid>
              <Grid>
                <Typography
                  sx={{ fontSize: 10, color: "#E0E0E0" }}
                  aria-label="movie category"
                >
                  {movie.category}
                </Typography>
              </Grid>
              <Grid>
                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    background: "#BDBDBD",
                    borderRadius: "50%",
                  }}
                />
              </Grid>
              <Grid>
                <Typography
                  sx={{ fontSize: 10, color: "#E0E0E0" }}
                  aria-label="movie rating"
                >
                  {movie.rating}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              sx={{
                color: "#E0E0E0",
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              aria-label="movie title"
            >
              {movie.title}
            </Typography>
          </Stack>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
            }}
          >
            <Box
              sx={{
                p: "1rem",
                backgroundColor: "black",
                borderRadius: "100%",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={handleToggleBookmark}
            >
              {isBookmarked ? (
                <BookmarkIcon fill={"#E0E0E0"} />
              ) : (
                <BookmarkEmptyIcon />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
      <TrailerModal
        open={trailer.open}
        onClose={trailer.close}
        videoKey={trailer.videoKey}
        loading={trailer.loading}
        error={trailer.error}
        title={movie.title}
      />
    </Card>
  );
};

export default MovieCard;
