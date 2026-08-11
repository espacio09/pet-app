import { render, screen } from "@testing-library/react";
import PetsList from ".PetsPage/PetsList";
import { describe, expect, it, vi } from "vitest";

// ✅ IMPORTANTE: mock correcto
vi.mock("../api/pets", () => ({
  getPets: vi.fn(() =>
    Promise.resolve([
      {
        pet_id: 15,
        pet_name: "Nala",
        weight: 28,
        color: "white",
        sex: "female",
        microchip_no: "1234567",
      },
    ])
  ),
}));

describe("PetsList", () => {
  it("renders pets from API", async () => {
    render(<PetsList />);

    const pet = await screen.findByText("Nala");

    expect(pet).toBeDefined();
  });
});