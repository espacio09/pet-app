import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AddVetDialog from "./AddVetDialog";
import { createVet } from "../types/vets";

vi.mock("../types/vets", () => ({
  createVet: vi.fn(),
}));

describe("AddVetDialog", () => {
  it("submits optional address fields to the vets API", async () => {
    const onAdded = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    vi.mocked(createVet).mockResolvedValue({});

    render(
      <AddVetDialog open onClose={onClose} onAdded={onAdded} />,
    );

    await screen.findByLabelText(/Nombre/);
    fireEvent.change(screen.getByLabelText(/Nombre/), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/), {
      target: { value: "Lovelace" },
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono/), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(createVet).toHaveBeenCalledWith({
        firstName: "Ada",
        lastName: "Lovelace",
        street: undefined,
        houseNumber: undefined,
        postalCode: undefined,
        city: undefined,
        email: "ada@example.com",
        phone: "12345",
      });
    });
    expect(onAdded).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("submits the separate address fields", async () => {
    vi.mocked(createVet).mockResolvedValue({});
    render(
      <AddVetDialog
        open
        onClose={vi.fn()}
        onAdded={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    await screen.findByLabelText(/Nombre/);
    fireEvent.change(screen.getByLabelText(/Nombre/), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/), {
      target: { value: "Lovelace" },
    });
    fireEvent.change(screen.getByLabelText(/Calle/), {
      target: { value: "Main Street" },
    });
    fireEvent.change(screen.getByLabelText(/Número/), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Código postal/), {
      target: { value: "60311" },
    });
    fireEvent.change(screen.getByLabelText(/Ciudad/), {
      target: { value: "Frankfurt" },
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono/), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(createVet).toHaveBeenCalledWith(
        expect.objectContaining({
          street: "Main Street",
          houseNumber: "1",
          postalCode: "60311",
          city: "Frankfurt",
        }),
      );
    });
  });

  it("shows a duplicate contact error returned by the API", async () => {
    vi.mocked(createVet).mockRejectedValueOnce(
      new Error("Ya existe un veterinario registrado con este teléfono."),
    );

    render(
      <AddVetDialog
        open
        onClose={vi.fn()}
        onAdded={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    await screen.findByLabelText(/Nombre/);
    fireEvent.change(screen.getByLabelText(/Nombre/), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByLabelText(/Apellido/), {
      target: { value: "Lovelace" },
    });
    fireEvent.change(screen.getByLabelText(/Ciudad/), {
      target: { value: "Frankfurt" },
    });
    fireEvent.change(screen.getByLabelText(/Calle/), {
      target: { value: "Main Street" },
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono/), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(
      await screen.findByText(
        "Ya existe un veterinario registrado con este teléfono.",
      ),
    ).toBeInTheDocument();
  });
});
