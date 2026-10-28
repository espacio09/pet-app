import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Owner } from "../types/Owner";
import { updateOwner } from "../types/owners";
import OwnerDetailModal from "./OwnerDetailModal";

vi.mock("../types/owners", () => ({
  updateOwner: vi.fn(),
}));

const owner: Owner = {
  ownerId: 7,
  firstName: "Luca",
  lastName: "Auer",
  address: "Nieder-Eschbach",
  email: "luca@example.com",
  phone: "123456",
};

function OwnerModalHarness() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir propietario</button>
      <OwnerDetailModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={async () => {}}
        owner={owner}
      />
    </>
  );
}

describe("OwnerDetailModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables fields when editing and saves the changes", async () => {
    const onSaved = vi.fn().mockResolvedValue(undefined);
    vi.mocked(updateOwner).mockResolvedValue(owner);

    render(
      <OwnerDetailModal
        open
        onClose={vi.fn()}
        onSaved={onSaved}
        owner={owner}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Nombre" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Nombre" }), {
      target: { value: "Lucas" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Dirección" }), {
      target: { value: "Frankfurt" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() =>
      expect(updateOwner).toHaveBeenCalledWith(7, {
        ownerId: 7,
        first_name: "Lucas",
        last_name: "Auer",
        email: "luca@example.com",
        phone: "123456",
        address: "Frankfurt",
      }),
    );
    await waitFor(() => expect(onSaved).toHaveBeenCalledOnce());
  });

  it("closes without saving and discards edits", async () => {
    render(<OwnerModalHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Nombre" }), {
      target: { value: "Unsaved name" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Cerrar" })[1]);

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(updateOwner).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Abrir propietario" }));
    expect(screen.getByRole("textbox", { name: "Nombre" })).toHaveValue("Luca");
    expect(screen.getByRole("button", { name: "Editar" })).toBeInTheDocument();
  });

  it("shows a duplicate-email message when saving Wolfgang's email", async () => {
    const wolfgang: Owner = {
      ownerId: 7,
      firstName: "Wolfgang",
      lastName: "Allendörfer",
      address: "Musterstraße 1",
      email: "",
      phone: "123456789",
    };
    const duplicateEmailMessage =
      "Ya existe un propietario registrado con este correo electrónico.";
    vi.mocked(updateOwner).mockRejectedValueOnce(
      new Error(duplicateEmailMessage),
    );

    render(
      <OwnerDetailModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn().mockResolvedValue(undefined)}
        owner={wolfgang}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(
      screen.getByRole("textbox", { name: "Correo electrónico" }),
      { target: { value: "WolfgangAllendoerfer@aol.com" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      duplicateEmailMessage,
    );
    expect(updateOwner).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        email: "WolfgangAllendoerfer@aol.com",
      }),
    );
  });
});
