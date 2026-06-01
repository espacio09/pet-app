import { render, screen, fireEvent } from "@testing-library/react";
import EditPet from "./EditPet";
import { describe, expect, it } from "vitest";

    describe("EditPet", () => {
    const pet = {
    pet_id: 1,
    pet_name: "Nala",
    weight: 28,
    color: "white",
  };

  it("renders form with pet data", () => {
    render(<EditPet pet={pet} onClose={() => {}} />);

    expect(screen.getByDisplayValue("28")).toBeDefined();
    expect(screen.getByDisplayValue("white")).toBeDefined();
  });

  it("updates input value", () => {
    render(<EditPet pet={pet} onClose={() => {}} />);

    const input = screen.getByLabelText("Weight");

    fireEvent.change(input, { target: { value: "30" } });

    expect((input as HTMLInputElement).value).toBe("30");
  });
});
