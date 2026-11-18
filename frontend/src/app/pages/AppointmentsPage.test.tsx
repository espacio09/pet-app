import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AppointmentsPage from "./AppointmentsPage";
import {
  deleteAppointments,
  getAppointments,
  updateAppointment,
} from "../types/appointments";

vi.mock("../types/appointments", () => ({
  getAppointments: vi.fn(),
  deleteAppointments: vi.fn(),
  updateAppointment: vi.fn(),
}));

vi.mock("../components/AddAppointmentDialog", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div role="dialog">Add appointment</div> : null,
}));

describe("AppointmentsPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const appointment = {
    appointmentId: 1,
    petId: 15,
    vetId: 3,
    appointmentDate: "2026-11-25T10:00:00.000Z",
    reason: "Examinacion defecacion",
    status: "SCHEDULED" as const,
    notes: "Bring vaccination records",
    petName: "Minnie Mouse",
    ownerName: "Tatjana Klatyik",
    vet: "Dr. Smith",
  };

  it("shows appointment, pet, owner, and veterinarian details", async () => {
    vi.mocked(getAppointments).mockResolvedValue([appointment]);

    render(
      <MemoryRouter>
        <AppointmentsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Minnie Mouse")).toBeInTheDocument();
    expect(screen.getByText("Tatjana Klatyik")).toBeInTheDocument();
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(screen.getByText("Examinacion defecacion")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Add appointment");
  });

  it("opens appointment details when a row is selected", async () => {
    vi.mocked(getAppointments).mockResolvedValue([appointment]);

    render(
      <MemoryRouter>
        <AppointmentsPage />
      </MemoryRouter>,
    );

    fireEvent.click(
      await screen.findByRole("row", {
        name: "Open appointment 1 details",
      }),
    );

    expect(
      screen.getByRole("dialog", { name: "Appointment details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByLabelText("Visit reason")).toHaveValue(
      "Examinacion defecacion",
    );
    expect(screen.getByLabelText("Notes")).toHaveValue(
      "Bring vaccination records",
    );
  });

  it("saves appointment changes from the details modal", async () => {
    const updatedAppointment = {
      ...appointment,
      reason: "Updated examination",
      status: "COMPLETED" as const,
      notes: "Updated notes",
    };
    vi.mocked(getAppointments)
      .mockResolvedValueOnce([appointment])
      .mockResolvedValueOnce([updatedAppointment]);
    vi.mocked(updateAppointment).mockResolvedValue(updatedAppointment);

    render(
      <MemoryRouter>
        <AppointmentsPage />
      </MemoryRouter>,
    );

    fireEvent.click(
      await screen.findByRole("row", {
        name: "Open appointment 1 details",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText(/Visit reason/), {
      target: { value: "Updated examination" },
    });
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "Updated notes" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByRole("button", { name: "Edit" });
    expect(
      await screen.findByText("Appointment changes saved."),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated examination")).toBeInTheDocument();
    expect(updateAppointment).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        reason: "Updated examination",
        status: "SCHEDULED",
        notes: "Updated notes",
      }),
    );
    expect(getAppointments).toHaveBeenCalledTimes(2);
  });

  it("deletes all checked appointments after confirmation", async () => {
    const secondAppointment = {
      ...appointment,
      appointmentId: 2,
      petName: "Bello",
      reason: "Follow-up",
    };
    vi.mocked(getAppointments)
      .mockResolvedValueOnce([appointment, secondAppointment])
      .mockResolvedValueOnce([]);
    vi.mocked(deleteAppointments).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AppointmentsPage />
      </MemoryRouter>,
    );

    await screen.findByRole("row", {
      name: "Open appointment 1 details",
    });
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Select appointment 1" }),
    );
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Select appointment 2" }),
    );
    expect(
      screen.queryByRole("dialog", { name: "Appointment details" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    const deleteDialog = screen.getByRole("dialog", {
      name: "Delete appointments",
    });
    expect(deleteDialog).toHaveTextContent("Examinacion defecacion");
    expect(deleteDialog).toHaveTextContent("Bello");
    fireEvent.click(within(deleteDialog).getByRole("button", { name: "No" }));
    expect(deleteAppointments).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Delete appointments" }),
      ).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(
      within(
        screen.getByRole("dialog", { name: "Delete appointments" }),
      ).getByRole("button", { name: "Yes, delete" }),
    );

    await screen.findByText("No appointments found.");
    expect(deleteAppointments).toHaveBeenCalledWith([1, 2]);
    expect(getAppointments).toHaveBeenCalledTimes(2);
  });
});
