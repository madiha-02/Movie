# Movie App

A React + TypeScript movie and TV series browser: search, browse trending titles, bookmark favorites, and play trailers. Movie and TV data comes live from [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## Tech Stack

- React 19 + TypeScript
- React Router 7 (client-side routing)
- MUI 9 (Material UI) for components and theming
- Create React App (`react-scripts`) for the build tooling
- [TMDB API](https://developer.themoviedb.org/docs) for movie/TV data and trailers

## Project Structure

- `src/pages` — route-level screens (splash, home, movies, TV series, bookmarks, error)
- `src/components` — reusable UI (movie cards, movie lists, sidebar, icons, trailer modal)
- `src/context` — global movie state (fetching, loading/error state, bookmark toggling) via React Context
- `src/services/tmdb.ts` — TMDB API client (trending/popular titles, trailer lookup)
- `src/hooks/useTrailer.ts` — hook that fetches a title's YouTube trailer key on demand

## Getting Started

### 1. Get a TMDB API key

This app needs a free TMDB API key to load any movies:

1. Create an account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** and request an **API Key (v3 auth)**.
3. Add it to `.env` in the project root:
   ```
   REACT_APP_TMDB_API_KEY=your_key_here
   ```

### 2. Install and run

```
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page reloads on edits.

Other scripts:

- `npm test` — run the test suite in watch mode
- `npm run build` — create a production build in `build/`

## Features

- **Browse**: trending titles and popular movies/TV series, pulled live from TMDB.
- **Search**: client-side filter across the currently loaded catalog.
- **Bookmarks**: persisted in `localStorage`, so they survive page reloads.
- **Trailers**: click the play button on any card to open a modal that streams its YouTube trailer (when TMDB has one for that title).

## Notes

Without a valid `REACT_APP_TMDB_API_KEY`, the app shows an error message instead of a catalog — there's no offline/mock fallback.
