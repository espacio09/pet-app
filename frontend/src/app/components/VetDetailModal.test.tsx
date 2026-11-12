import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Vet } from "../types/Vet";
import { updateVet } from "../types/vets";
import VetDetailModal from "./VetDetailModal";

vi.mock("../types/vets", () => ({
  updateVet: vi.fn(),
}));

const vet: Vet = {
  vetId: 9999,
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "12345",
  country: "Germany",
  phoneCountryCode: "+49",
  specialization: "Cardiology",
  notes: "Available on weekends",
};

describe("VetDetailModal", () => {
  it("shows the full vet ID and all profile details", () => {
    render(
      <VetDetailModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn().mockResolvedValue(undefined)}
        vet={vet}
      />,
    );

    expect(screen.getByRole("textbox", { name: "ID" })).toHaveValue("9999");
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
    expect(screen.getByRole("textbox", { name: "País" })).toHaveValue("Germany");
    expect(
      screen.getByRole("textbox", { name: "Código de país del teléfono" }),
    ).toHaveValue("+49");
    expect(
      screen.getByRole("textbox", { name: "Especialización" }),
    ).toHaveValue("Cardiology");
    expect(screen.getByRole("textbox", { name: "Notas" })).toHaveValue(
      "Available on weekends",
    );
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
    fireEvent.change(screen.getByRole("textbox", { name: "País" }), {
      target: { value: "Germany" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Código de país del teléfono" }),
      { target: { value: "+49" } },
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Especialización" }), {
      target: { value: "Cardiology" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Notas" }), {
      target: { value: "Available on weekends" },
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
        country: "Germany",
        phoneCountryCode: "+49",
        specialization: "Cardiology",
        notes: "Available on weekends",
      }),
    );
  });

  it("requires a country before updating a vet", async () => {
    render(
      <VetDetailModal
        open
        onClose={vi.fn()}
        onSaved={vi.fn().mockResolvedValue(undefined)}
        vet={vet}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.change(screen.getByRole("textbox", { name: "País" }), {
      target: { value: "  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Nombre, apellido, correo electrónico, teléfono y país son obligatorios.",
    );
    expect(updateVet).not.toHaveBeenCalled();
  });
});
