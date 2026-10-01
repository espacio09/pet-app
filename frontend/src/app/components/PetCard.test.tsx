import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PetCard from "./PetCard";
import type { Pet } from "../types/Pet";

const pet: Pet = {
  petId: 1,
  petName: "Nala",
  ownerId: 7,
  ownerName: "Ana García",
  birthdate: new Date("2021-02-03"),
  age: 5,
  sex: "female",
  color: "white",
  microchip_no: 123456,
  weight: 12,
  pet_typeId: 1,
  breed_id: 2,
};

describe("PetCard", () => {
  it("shows the owner name and opens the pet details when selected", () => {
    const onSelect = vi.fn();

    render(<PetCard pet={pet} onSelect={onSelect} />);

    expect(screen.getByText("Ana García")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Ver detalles de Nala" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});