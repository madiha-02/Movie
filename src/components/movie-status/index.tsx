import { Box, CircularProgress, Typography } from "@mui/material";

interface MovieStatusProps {
  loading: boolean;
  error: string | null;
}

const MovieStatus = ({ loading, error }: MovieStatusProps) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 6 }}>
        <CircularProgress size={24} sx={{ color: "#E0E0E0" }} />
        <Typography>Loading from TMDB...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Typography sx={{ color: "#FC4747", py: 6 }}>
        {error}
      </Typography>
    );
  }
  return null;
};

export default MovieStatus;
