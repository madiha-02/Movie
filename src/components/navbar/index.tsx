import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import ThemeToggle from "../theme-toggle";
import { useThemeMode } from "../../context/theme-context";
import homeIcon from "../../assets/icons/icon-nav-home.svg";
import movieIcon from "../../assets/icons/icon-nav-movies.svg";
import tvSeriesIcon from "../../assets/icons/icon-nav-tv-series.svg";
import bookmarkIcon from "../../assets/icons/icon-nav-bookmark.svg";

const navLinks = [
  { name: "Home", icon: homeIcon, link: "/home" },
  { name: "Movies", icon: movieIcon, link: "/movies" },
  { name: "TV Series", icon: tvSeriesIcon, link: "/tv-series" },
  { name: "Bookmarks", icon: bookmarkIcon, link: "/bookmarks" },
];

interface NavbarProps {
  search?: ReactNode;
}

const Navbar = ({ search }: NavbarProps) => {
  const { pathname } = useLocation();
  const { mode } = useThemeMode();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        px: { xs: 1.5, sm: 3 },
        py: 1.5,
        gap: { xs: 1.5, md: 2 },
      }}
    >
      <Box
        sx={{
          order: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <LocalMoviesIcon sx={{ color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, display: { xs: "none", lg: "block" } }}
          >
            Movie Store
          </Typography>
        </Stack>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <ThemeToggle />
        </Box>
      </Box>

      {search && (
        <Box
          sx={{
            order: { xs: 3, md: 2 },
            width: { xs: "100%", md: 260, lg: 320 },
            flexShrink: 0,
          }}
        >
          {search}
        </Box>
      )}

      <Stack
        direction="row"
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          order: { xs: 2, md: 3 },
          overflowX: "auto",
          justifyContent: { xs: "space-around", md: "flex-start" },
          ml: { md: "auto" },
        }}
      >
        {navLinks.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link key={item.name} to={item.link} style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "action.hover",
                  },
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{
                    width: "16px",
                    filter: isActive
                      ? "brightness(0) invert(1)"
                      : mode === "dark"
                      ? "invert(84%)"
                      : "none",
                  }}
                />
                <Typography sx={{ display: { xs: "none", md: "block" }, fontSize: 14 }}>
                  {item.name}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </Stack>

      <Box sx={{ order: 4, display: { xs: "none", md: "flex" } }}>
        <ThemeToggle />
      </Box>
    </Box>
  );
};

export default Navbar;
