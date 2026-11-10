import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { getVets } from "../../../types/vets";
import VetsPage from "./VetsPage";

vi.mock("../../../types/vets", () => ({
  getVets: vi.fn().mockResolvedValue([
    {
      id: 7,
      firstName: "Ada",
      lastName: "Lovelace",
      street: "Main Street",
      houseNumber: "12A",
      postalCode: "60311",
      city: "Frankfurt",
      email: "ada@example.com",
      phone: "12345",
    },
  ]),
  createVet: vi.fn(),
  updateVet: vi.fn(),
  deleteVet: vi.fn(),
}));

describe("VetsPage", () => {
  it("loads and displays veterinarians from the vets API", async () => {
    render(
      <MemoryRouter>
        <VetsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("1 veterinarios registrados")).toBeInTheDocument();
    expect(getVets).toHaveBeenCalledOnce();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Main Street")).toBeInTheDocument();
    expect(screen.getByText("12A")).toBeInTheDocument();
    expect(screen.getByText("60311")).toBeInTheDocument();
    expect(screen.getByText("Frankfurt")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("shows the API error and lets the user retry loading vets", async () => {
    vi.mocked(getVets).mockRejectedValueOnce(
      new Error("No se pudo conectar con el servidor."),
    );

    render(
      <MemoryRouter>
        <VetsPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("No se pudo conectar con el servidor."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });
});
