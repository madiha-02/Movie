import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeMode } from "../../context/theme-context";

const ThemeToggle = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <IconButton
      aria-label={mode === "dark" ? "switch to light mode" : "switch to dark mode"}
      onClick={toggleMode}
      sx={{ color: mode === "dark" ? "primary.main" : "secondary.main" }}
    >
      {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeToggle;
