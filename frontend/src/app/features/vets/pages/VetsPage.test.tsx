import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VetsPage from "./VetsPage";

vi.mock("../../../types/vets", () => ({
  getVets: vi.fn().mockResolvedValue([
    {
      id: 7,
      firstName: "Ada",
      lastName: "Lovelace",
      address: "Main Street",
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
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Lovelace")).toBeInTheDocument();
  });
});
