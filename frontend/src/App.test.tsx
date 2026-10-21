import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("Homepage", () => {
  it("renders the home page by default", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Bienvenida/i)).toBeInTheDocument();
  });

  it("shows the owners card", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Proprietarios/i)).toBeInTheDocument();
  });
});