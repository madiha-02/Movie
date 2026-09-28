import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

type ThemeMode = "dark" | "light";

const STORAGE_KEY = "movie-app:theme-mode";

const loadStoredMode = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleMode: () => void;
}>({
  mode: "dark",
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(loadStoredMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage unavailable - theme choice just won't persist
      }
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#6C5CE7" },
          secondary: { main: "#FFB400" },
          ...(mode === "dark"
            ? {
                background: { default: "#10141F", paper: "#161d2f" },
                text: { primary: "#ffffff", secondary: "#E0E0E0" },
              }
            : {
                background: { default: "#EEF0FA", paper: "#FFFFFF" },
                text: { primary: "#1B1F3B", secondary: "#5C6079" },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
