import { InputAdornment, InputBase, Paper } from "@mui/material";
import SearchIcon from "../../assets/icons/icon-search.svg";
import { useThemeMode } from "../../context/theme-context";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const { mode } = useThemeMode();

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        p: 1,
        backgroundColor: "background.default",
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <InputBase
        placeholder="Search"
        sx={{
          ml: 1,
          flex: 1,
          color: "text.primary",
          fontSize: 14,
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <img
              src={SearchIcon}
              alt="search icon"
              width={20}
              height={20}
              style={{ filter: mode === "light" ? "invert(1)" : "none" }}
            />
          </InputAdornment>
        }
      />
    </Paper>
  );
};

export default SearchBar;
