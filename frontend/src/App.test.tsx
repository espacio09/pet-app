import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

vi.mock("./app/types/owners", () => ({
  getOwners: vi.fn().mockResolvedValue([]),
}));

vi.mock("./app/types/appointments", () => ({
  getAppointments: vi.fn().mockResolvedValue([]),
  getPetAppointments: vi.fn().mockResolvedValue([]),
  createAppointment: vi.fn(),
}));

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

  it("opens the appointments list route", async () => {
    render(
      <MemoryRouter initialEntries={["/appointments"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Appointments" }),
    ).toBeInTheDocument();
  });
});