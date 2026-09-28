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

interface MovieTrendCardProps {
  movie: MovieDataType;
}

const MovieTrendCard = ({ movie }: MovieTrendCardProps) => {
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
      key={movie.id}
      elevation={0}
      style={{ backgroundColor: "transparent" }}
    >
      <CardContent
        onClick={handleOpenDetails}
        style={{
          padding: 0,
          position: "relative",
          overflowX: "scroll",
          display: "flex",
          cursor: "pointer",
        }}
      >
        <img
          src={movie.thumbnail.trending?.large || movie.thumbnail.regular.large}
          alt=""
          style={{ width: "300px", height: "100%", borderRadius: "8px" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
          sx={{ mt: "6", position: "absolute", bottom: 0, left: 0, right: 0, p: 4 }}
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
                  width: "1rem",
                  height: "1rem",
                  bg: "#E0E0E0",
                  borderRadius: "full",
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
                  width: "1rem",
                  height: "1rem",
                  bg: "#E0E0E0",
                  borderRadius: "full",
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
          <Typography sx={{ color: "#E0E0E0", padding: 0 }} aria-label="movie title">
            {movie.title}
          </Typography>
        </Stack>
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px",
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

export default MovieTrendCard;
