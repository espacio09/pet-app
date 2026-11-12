import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Vet } from "../types/Vet";
import VetsList from "./VetsList";

const vets: Vet[] = [
  {
    vetId: 7,
    firstName: "Ada",
    lastName: "Lovelace",
    street: "Main Street",
    houseNumber: "12A",
    postalCode: "60311",
    city: "Frankfurt",
    country: "Germany",
    phoneCountryCode: "+49",
    phone: "12345",
    email: "ada@example.com",
    specialization: "Cardiology",
    notes: "Available on weekends",
  },
];

describe("VetsList", () => {
  it("renders every requested vet column and the loaded vet values", async () => {
    render(
      <VetsList
        vets={vets}
        onSelect={vi.fn()}
        selectedVetIds={[]}
        onSelectionChange={vi.fn()}
      />,
    );

    const headers = screen
      .getAllByRole("columnheader")
      .map((header) => header.textContent?.trim());

    expect(headers).toEqual([
      "",
      "ID",
      "Nombre",
      "Apellido",
      "Calle",
      "Número",
      "Código postal",
      "Ciudad",
      "País",
      "Código país teléfono",
      "Teléfono",
      "Correo electrónico",
      "Especialización",
      "Notas",
    ]);

    const cells = await screen.findAllByRole("gridcell");
    const cellValues = cells.map((cell) => cell.textContent?.trim());

    expect(cellValues).toEqual(
      expect.arrayContaining([
        "7",
        "Ada",
        "Lovelace",
        "Main Street",
        "12A",
        "60311",
        "Frankfurt",
        "Germany",
        "+49",
        "12345",
        "ada@example.com",
        "Cardiology",
        "Available on weekends",
      ]),
    );
  }, 15000);
});
