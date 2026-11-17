import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AppointmentsPage from "./AppointmentsPage";
import { getAppointments } from "../types/appointments";

vi.mock("../types/appointments", () => ({
  getAppointments: vi.fn(),
}));

vi.mock("../components/AddAppointmentDialog", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Add appointment</div> : null,
}));

describe("AppointmentsPage", () => {
  it("shows appointment, pet, owner, and veterinarian details", async () => {
    vi.mocked(getAppointments).mockResolvedValue([
      {
        appointmentId: 1,
        petId: 15,
        vetId: 3,
        appointmentDate: "2026-11-25T10:00:00.000Z",
        reason: "Annual vaccination",
        status: "SCHEDULED",
        petName: "Minnie Mouse",
        ownerName: "Tatjana Klatyik",
        vet: "Dr. Smith",
      },
    ]);

    render(
      <MemoryRouter>
        <AppointmentsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Minnie Mouse")).toBeInTheDocument();
    expect(screen.getByText("Tatjana Klatyik")).toBeInTheDocument();
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(screen.getByText("Annual vaccination")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Add appointment");
  });
});
