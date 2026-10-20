import {render, screen} from "@testing-library/react";
import { expect, it } from "vitest";
import App from "./App";    


it ("renders the home page by default", () => {
  render(<App />);
  expect(screen.getByText(/Bienvenida/i)).toBeInTheDocument();
});
