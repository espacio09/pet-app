import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOwner, DuplicateOwnerNameError } from "../types/owners";
import AddOwnerDialog from "./AddOwnerDialog";

vi.mock("../types/owners", async () => {
  const actual = await vi.importActual("../types/owners");

  return {
    ...actual,
    createOwner: vi.fn(),
  };
});

describe("AddOwnerDialog", () => {
  beforeEach(() => {
  vi.resetAllMocks();
});
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

    fireEvent.change(screen.getByRole("textbox", { name: /nombre/i }), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /apellido/i }), {
      target: { value: "García" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /dirección/i }), {
      target: { value: "Calle 1" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: /Correo electrónico/i }),
      { target: { value: "ana@example.com" } },
    );
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
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

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /nombre/i,
    }),
    {
      target: { value: "Ana" },
    },
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: /apellido/i,
    }),
    {
      target: { value: "García" },
    },
  );

  fireEvent.change(
  screen.getByLabelText(/dirección/i),
  {
    target: { value: "Calle 1" },
  }
);

  fireEvent.change(
    screen.getByLabelText(/teléfono/i),
  {
    target: { value: "123456789" },
  },
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: /add/i,
    }),
  );

  expect(
    await screen.findByRole("alert"),
  ).toHaveTextContent(
    "Ya existe un propietario con el mismo nombre y apellido.",
  );

  expect(
    screen.getByRole("button", {
      name: /revisar datos/i,
    }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: /confirmar y guardar/i,
    }),
  );

  expect(createOwner).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      first_name: "Ana",
      last_name: "García",
      confirm_duplicate_name: true,
    }),
  );

 await waitFor(() => {
  expect(onAdded).toHaveBeenCalledOnce();
});
  });
});