import { useContext } from "react";
import Layout from "../../Layout";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/search-bar";
import MovieList from "../../components/movie-list";
import MovieStatus from "../../components/movie-status";
import { MovieContext } from "../../context/movie-context";
import { useMovieSearch } from "../../hooks/useMovieSearch";

const Movie = () => {
  const { state } = useContext(MovieContext);
  const { movies, loading, error } = state;
  const { query, setQuery, results, loading: searchLoading } = useMovieSearch("movie");
  const movieList = movies.filter((movie) => movie.category === "Movie");
  const isSearching = query.trim() !== "";

  return (
    <Layout search={<SearchBar value={query} onChange={setQuery} />}>
      <Box sx={{ py: 2, px: { xs: 2, sm: 4 } }}>
        {!isSearching ? (
          <>
            <MovieStatus loading={loading} error={error} />
            {!loading && !error ? (
              <Box sx={{ width: "100%" }}>
                <Typography variant="h5" component="h1" sx={{ my: 6, fontWeight: 400 }}>
                  Movies
                </Typography>
                <MovieList recommendList={movieList} />
              </Box>
            ) : null}
          </>
        ) : (
          <Box sx={{ width: "100%" }}>
            <MovieStatus loading={searchLoading} error={null} />
            {!searchLoading ? (
              <>
                <Typography sx={{ my: 3 }}>
                  Found {results.length} results for "{query}"
                </Typography>
                <MovieList recommendList={results} />
              </>
            ) : null}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Movie;
