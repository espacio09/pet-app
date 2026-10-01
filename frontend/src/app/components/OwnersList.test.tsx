import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Owner } from "../types/Owner";
import OwnersList from "./OwnersList";

const owners: Owner[] = [
  {
    ownerId: 1,
    firstName: "Ana",
    lastName: "Zuluaga",
    email: "ana@example.com",
    phone: "123456",
  },
  {
    ownerId: 2,
    firstName: "Carlos",
    lastName: "Andres",
    email: "carlos@example.com",
    phone: "654321",
  },
];

describe("OwnersList selection", () => {
  it("allows selecting multiple owners without opening their details", () => {
    const onSelect = vi.fn();
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <OwnersList
        owners={owners}
        selectedOwnerIds={[]}
        onSelect={onSelect}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Seleccionar Ana Zuluaga" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith([1]);

    rerender(
      <OwnersList
        owners={owners}
        selectedOwnerIds={[1]}
        onSelect={onSelect}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Seleccionar Carlos Andres" }));

    expect(onSelectionChange).toHaveBeenLastCalledWith([1, 2]);
    expect(onSelect).not.toHaveBeenCalled();
  });
});