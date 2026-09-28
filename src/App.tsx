import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { MovieProvider } from "./context/movie-context";
import { ThemeModeProvider } from "./context/theme-context";
import "./App.css";

function App() {
  return (
    <ThemeModeProvider>
      <MovieProvider>
        <RouterProvider router={router} />
      </MovieProvider>
    </ThemeModeProvider>
  );
}

export default App;
