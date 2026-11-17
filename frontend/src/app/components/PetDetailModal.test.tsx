import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Pet } from "../types/Pet";
import { updatePet } from "../types/pets";
import PetDetailModal from "./PetDetailModal";

vi.mock("../types/pets", () => ({
  checkMicrochipAvailability: vi.fn(),
  updatePet: vi.fn(),
}));

vi.mock("./PetAppointments", () => ({
  default: () => null,
}));

const pet: Pet = {
  petId: 3,
  petName: "Minnie",
  ownerId: 7,
  ownerName: "Luca Auer",
  birthdate: new Date("2023-01-01T00:00:00.000Z"),
  age: 3,
  sex: "female",
  color: "white",
  microchip_no: 12345,
  weight: 4,
  pet_typeId: 1,
  breed_id: 1,
  breedName: "Pomeranian",
};

describe("PetDetailModal", () => {
  it("shows a clear message when the server returns an internal error", async () => {
    vi.mocked(updatePet).mockRejectedValueOnce(
      new Error("Internal server error"),
    );

    render(
      <PetDetailModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn().mockResolvedValue(undefined)}
        pet={pet}
      />,
    );

    await waitFor(() =>
      expect(screen.getByText("Name:")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
        "Minnie",
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo guardar la mascota. Inténtalo de nuevo.",
    );
  });
});
