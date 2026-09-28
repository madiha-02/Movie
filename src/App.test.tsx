import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders splash screen", () => {
  render(<App />);
  expect(screen.getByTestId("TvIcon")).toBeInTheDocument();
});
