import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Vet } from "../types/Vet";
import { updateVet } from "../types/vets";
import VetDetailModal from "./VetDetailModal";

vi.mock("../types/vets", () => ({
  updateVet: vi.fn(),
}));

const vet: Vet = {
  vetId: 7,
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "12345",
};

describe("VetDetailModal", () => {
  it("shows the full vet ID above the two-column details form", () => {
    render(
      <VetDetailModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn().mockResolvedValue(undefined)}
        vet={vet}
      />,
    );

    expect(screen.getByRole("textbox", { name: "ID" })).toHaveValue("7");
    expect(screen.getByRole("textbox", { name: "ID" })).toBeDisabled();
    const firstNameInput = screen.getByLabelText(/Nombre/);
    const firstNameLabel = firstNameInput
      .closest(".MuiBox-root")
      ?.querySelector("label");
    expect(firstNameLabel).toHaveTextContent("Nombre");
    expect(firstNameLabel).toHaveClass("MuiTypography-root");
    expect(
      screen.getByRole("group", { name: "Datos del veterinario" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveClass("MuiDialog-paperWidthLg");
  });

  it("shows a clear message when the server returns an internal error", async () => {
    vi.mocked(updateVet).mockRejectedValueOnce(
      new Error("Internal server error"),
    );

    render(
      <VetDetailModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn().mockResolvedValue(undefined)}
        vet={vet}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Calle" }), {
      target: { value: "New Street" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Número" }), {
      target: { value: "9" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Código postal" }), {
      target: { value: "10115" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Ciudad" }), {
      target: { value: "Berlin" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo guardar el veterinario. Inténtalo de nuevo.",
    );
    expect(updateVet).toHaveBeenCalledWith(
      vet.vetId,
      expect.objectContaining({
        phone: "12345",
        street: "New Street",
        houseNumber: "9",
        postalCode: "10115",
        city: "Berlin",
      }),
    );
  });
});
