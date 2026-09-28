import { Box, Paper } from "@mui/material";
import React from "react";
import { MovieDataType } from "../../assets/data";
import MovieTrendCard from "../movie-card/movieTrend";

interface MovieTrendListProps {
  trendingList: MovieDataType[];
}

const MovieTrendList = ({ trendingList }: MovieTrendListProps) => {
  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "scroll" }}>
      {trendingList.map((movie) => (
        <Box key={movie.id} sx={{ flexShrink: 0 }}>
          <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
            <MovieTrendCard movie={movie} />
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default MovieTrendList;
