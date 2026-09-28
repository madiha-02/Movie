import { useState, useContext } from "react";
import Layout from "../../Layout";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/search-bar";
import MovieList from "../../components/movie-list";
import { MovieDataType } from "../../assets/data";
import { MovieContext } from "../../context/movie-context";

const Bookmark = () => {
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState<MovieDataType[]>([]);
  const { state } = useContext(MovieContext);
  const bookmarks = Object.values(state.bookmarks);
  const handleSearch = (value: string) => {
    setSearch(value);
    const newList = bookmarks.filter((movie) =>
      movie.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchList(newList);
  };
  return (
    <Layout search={<SearchBar value={search} onChange={handleSearch} />}>
      <Box sx={{ py: 2, px: { xs: 2, sm: 4 } }}>
        {search === "" ? (
          <Box sx={{ width: "100%" }}>
            <Typography variant="h5" component="h1" sx={{ my: 6, fontWeight: 400 }}>
              Bookmarks
            </Typography>
            {bookmarks.length === 0 ? (
              <Typography sx={{ color: "text.secondary" }}>
                You haven't bookmarked anything yet.
              </Typography>
            ) : (
              <MovieList recommendList={bookmarks} />
            )}
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Typography>
              Found {searchList.length} results for "{search}"{""}
            </Typography>
            <MovieList recommendList={searchList} />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Bookmark;
