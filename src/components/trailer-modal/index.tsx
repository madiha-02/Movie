import { Box, CircularProgress, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  videoKey: string | null;
  loading: boolean;
  error: string | null;
  title: string;
}

const TrailerModal = ({
  open,
  onClose,
  videoKey,
  loading,
  error,
  title,
}: TrailerModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { backgroundColor: "#10141f" } } }}
    >
      <Box sx={{ position: "relative", pt: "56.25%" }}>
        <IconButton
          onClick={onClose}
          aria-label="close trailer"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.6)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "#E0E0E0" }} />
          </Box>
        )}

        {!loading && error && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 4,
            }}
          >
            <Typography sx={{ color: "#E0E0E0", textAlign: "center" }}>
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && videoKey && (
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default TrailerModal;
