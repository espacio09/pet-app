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
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo guardar el veterinario. Inténtalo de nuevo.",
    );
  });
});
