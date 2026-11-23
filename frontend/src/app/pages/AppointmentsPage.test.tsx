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

vi.mock("../types/visits", () => ({
  createVisit: vi.fn(),
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

  it("opens the create visit modal from appointment details", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: "Crear Visit" }));

    const createVisitDialog = screen.getByRole("dialog", {
      name: "Crear Visit",
    });
    expect(createVisitDialog).toBeInTheDocument();
    expect(within(createVisitDialog).getByLabelText("Appointment ID")).toHaveValue(
      "1",
    );
    expect(within(createVisitDialog).getByLabelText("Visit ID")).toBeDisabled();
    expect(within(createVisitDialog).getByLabelText("Billing ID")).toBeDisabled();
  });

  it("saves appointment changes from the details modal", async () => {
    const appointmentDate = new Date("2026-12-03T14:45").toISOString();
    const updatedAppointment = {
      ...appointment,
      appointmentDate,
      reason: "Vaccination",
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
    fireEvent.change(screen.getByLabelText(/Date/), {
      target: { value: "2026-12-03" },
    });
    fireEvent.change(screen.getByLabelText(/Time/), {
      target: { value: "14:45" },
    });
    fireEvent.mouseDown(
      screen.getByRole("combobox", { name: "Visit reason" }),
    );
    expect(
      (await screen.findAllByRole("option")).map((option) => option.textContent),
    ).toEqual([
      "Examinacion defecacion",
      "Vaccination",
      "Eye Examination",
      "Dientes",
      "General Check-up",
      "Consultation",
      "Injury",
      "Illness",
      "Surgery Follow-up",
      "Emergency",
    ]);
    fireEvent.click(screen.getByRole("option", { name: "Vaccination" }));
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "Updated notes" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByRole("button", { name: "Edit" });
    expect(
      await screen.findByText("Appointment changes saved."),
    ).toBeInTheDocument();
    expect(screen.getByText("Vaccination")).toBeInTheDocument();
    expect(updateAppointment).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        appointmentDate,
        reason: "Vaccination",
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
