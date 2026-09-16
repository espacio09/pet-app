import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PetsList from "./PetsList";

describe("PetsList", () => {
  it("shows the owner full name resolved from the pet ownerId", async () => {
    render(
      <PetsList
        pets={[
          {
            petId: 1,
            petName: "Nala",
            ownerId: 7,
            birthdate: new Date("2021-02-03"),
            age: 3,
            sex: "female",
            color: "white",
            microchip_no: 123456,
            weight: 12,
            pet_typeId: 1,
            breed_id: 2,
          },
        ]}
        owners={[
          {
            ownerId: 7,
            firstName: "Ana",
            lastName: "García",
            email: "ana@test.com",
            phone: "123",
          },
        ]}
        onSelect={() => {}}
      />
    );

    const ownerName = await screen.findByText("Ana García");
    expect(ownerName).toBeTruthy();
  });

  it("shows the updated owner name returned with the pet", async () => {
    render(
      <PetsList
        pets={[
          {
            petId: 1,
            petName: "Nala",
            ownerId: 8,
            ownerName: "Luca Auer",
            birthdate: new Date("2021-02-03"),
            age: 3,
            sex: "female",
            color: "white",
            microchip_no: 123456,
            weight: 12,
            pet_typeId: 1,
            breed_id: 2,
          },
        ]}
        owners={[]}
        onSelect={() => {}}
      />
    );

    expect(await screen.findByText("Luca Auer")).toBeTruthy();
  });

  it("sorts pets by name from A to Z", async () => {
    render(
      <PetsList
        pets={[
          {
            petId: 1,
            petName: "Nala",
            ownerId: 7,
            birthdate: new Date("2021-02-03"),
            age: 3,
            sex: "female",
            color: "white",
            microchip_no: 123456,
            weight: 12,
            pet_typeId: 1,
            breed_id: 2,
          },
          {
            petId: 2,
            petName: "Bella",
            ownerId: 7,
            birthdate: new Date("2020-02-03"),
            age: 4,
            sex: "female",
            color: "black",
            microchip_no: 654321,
            weight: 10,
            pet_typeId: 1,
            breed_id: 2,
          },
        ]}
        owners={[]}
        onSelect={() => {}}
      />
    );

    const petNames = (await screen.findAllByRole("gridcell"))
      .map((cell) => cell.textContent)
      .filter((name) => name === "Bella" || name === "Nala");

    expect(petNames).toEqual(["Bella", "Nala"]);
  });
});