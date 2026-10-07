import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createOwner, DuplicateOwnerNameError } from "../types/owners";
import AddOwnerDialog from "./AddOwnerDialog";

vi.mock("../types/owners", () => ({
  createOwner: vi.fn(),
}));

describe("AddOwnerDialog", () => {
  it("shows the backend message when the email is already registered", async () => {
    const message = "Ya existe un propietario registrado con este correo electrónico.";
    vi.mocked(createOwner).mockRejectedValueOnce(new Error(message));

    render(
      <AddOwnerDialog
        open
        onClose={vi.fn()}
        onAdded={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Apellido"), {
      target: { value: "García" },
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Calle 1" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "123456789" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(message);
  });

  it("asks the user to verify duplicate names before allowing creation", async () => {
    const onAdded = vi.fn().mockResolvedValue(undefined);
    vi.mocked(createOwner)
      .mockRejectedValueOnce(
        new DuplicateOwnerNameError(
          "Ya existe un propietario con el mismo nombre y apellido. Por favor, verifica que sea correcto.",
        ),
      )
      .mockResolvedValueOnce({});

    render(
      <AddOwnerDialog open onClose={vi.fn()} onAdded={onAdded} />,
    );

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText("Apellido"), {
      target: { value: "García" },
    });
    fireEvent.change(screen.getByLabelText("Dirección"), {
      target: { value: "Calle 1" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "123456789" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ya existe un propietario con el mismo nombre y apellido.",
    );
    expect(screen.getByRole("button", { name: "Revisar datos" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar y guardar" }));

    expect(createOwner).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        first_name: "Ana",
        last_name: "García",
        confirm_duplicate_name: true,
      }),
    );
    expect(onAdded).toHaveBeenCalledOnce();
  });
});
