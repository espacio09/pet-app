import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateVisitDialog from "./CreateVisitDialog";
import { createVisit } from "../types/visits";

vi.mock("../types/visits", () => ({
  createVisit: vi.fn(),
}));

describe("CreateVisitDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const appointment = {
    appointmentId: 1,
    petId: 15,
    vetId: 3,
    appointmentDate: "2026-11-25T10:00:00.000Z",
    reason: "Vaccination",
    status: "SCHEDULED" as const,
    notes: "Appointment note",
    petName: "Minnie Mouse",
    ownerName: "Tatjana Klatyik",
    vet: "Dr. Smith",
  };

  it("creates a visit with updated appointment and clinical details", async () => {
    vi.mocked(createVisit).mockResolvedValue({
      visitId: 8,
      appointmentId: 1,
      billingId: null,
      reason: "Annual check",
      diagnosis: "Healthy",
      treatment: "No treatment needed",
      medication: "None",
      visitNotes: "Follow up next year",
      indication: "Return in 12 months",
      status: "SCHEDULED",
    });
    const onCreated = vi.fn().mockResolvedValue(undefined);
    const appointmentDate = new Date("2026-12-03T14:45").toISOString();

    render(
      <CreateVisitDialog
        open
        appointment={appointment}
        onClose={vi.fn()}
        onCreated={onCreated}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Date/), {
      target: { value: "2026-12-03" },
    });
    fireEvent.change(screen.getByLabelText(/Time/), {
      target: { value: "14:45" },
    });
    fireEvent.change(screen.getByLabelText(/Motivo/), {
      target: { value: "Annual check" },
    });
    fireEvent.change(screen.getByLabelText("Diagnóstico"), {
      target: { value: "Healthy" },
    });
    fireEvent.change(screen.getByLabelText("Tratamiento"), {
      target: { value: "No treatment needed" },
    });
    fireEvent.change(screen.getByLabelText("Medicación"), {
      target: { value: "None" },
    });
    fireEvent.change(screen.getByLabelText("Visit notes"), {
      target: { value: "Follow up next year" },
    });
    fireEvent.change(screen.getByLabelText("Indicación"), {
      target: { value: "Return in 12 months" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save Visit" }));

    expect(createVisit).toHaveBeenCalledWith(1, {
      appointment: {
        appointmentDate,
        reason: "Vaccination",
        status: "SCHEDULED",
        notes: "Appointment note",
      },
      reason: "Annual check",
      diagnosis: "Healthy",
      treatment: "No treatment needed",
      medication: "None",
      visitNotes: "Follow up next year",
      indication: "Return in 12 months",
      status: "SCHEDULED",
    });
    expect(await screen.findByText("Visit 8 created.")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit ID")).toHaveValue("8");
    expect(screen.getByLabelText("Billing ID")).toHaveValue("");
    expect(onCreated).toHaveBeenCalledOnce();
  }, 10000);
});
