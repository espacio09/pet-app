import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PetAppointments from "./PetAppointments";
import { createAppointment, getPetAppointments } from "../types/appointments";
import { getVets } from "../types/vets";

vi.mock("../types/appointments", () => ({
  createAppointment: vi.fn(),
  getPetAppointments: vi.fn(),
}));

vi.mock("../types/vets", () => ({
  getVets: vi.fn(),
}));

describe("PetAppointments", () => {
  it("creates a scheduled appointment for this pet and refreshes the list", async () => {
    vi.mocked(getPetAppointments)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          appointmentId: 1,
          petId: 15,
          vetId: 3,
          appointmentDate: "2026-11-25T09:00:00.000Z",
          reason: "Annual vaccination",
          status: "SCHEDULED",
          vet: "Dr. Smith",
        },
      ]);
    vi.mocked(getVets).mockResolvedValue([
      { id: 3, firstName: "Smith", lastName: "Jones" },
    ]);
    vi.mocked(createAppointment).mockResolvedValue({
      appointmentId: 1,
      petId: 15,
      vetId: 3,
      appointmentDate: "2026-11-25T09:00:00.000Z",
      reason: "Annual vaccination",
      status: "SCHEDULED",
    });

    render(<PetAppointments petId={15} />);

    await screen.findByText("No appointments yet.");
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Veterinarian" }));
    fireEvent.click(await screen.findByRole("option", { name: "Smith Jones" }));
    fireEvent.change(screen.getByLabelText("Appointment date"), {
      target: { value: "2026-11-25T10:00" },
    });
    fireEvent.change(screen.getByLabelText("Reason"), {
      target: { value: "Annual vaccination" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Create appointment" }),
    );

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          petId: 15,
          vetId: 3,
          reason: "Annual vaccination",
          status: "SCHEDULED",
        }),
      );
    });
    expect(getPetAppointments).toHaveBeenCalledTimes(2);
    expect(await screen.findByText(/Annual vaccination · SCHEDULED/))
      .toBeInTheDocument();
  });
});
