import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AddAppointmentDialog from "./AddAppointmentDialog";
import { createAppointment } from "../types/appointments";
import { useOwners } from "../hooks/useOwners";
import { usePets } from "../hooks/usePets";
import { useVets } from "../hooks/useVets";

vi.mock("../types/appointments", () => ({
  createAppointment: vi.fn(),
}));

vi.mock("../hooks/usePets", () => ({
  usePets: vi.fn(),
}));

vi.mock("../hooks/useOwners", () => ({
  useOwners: vi.fn(),
}));

vi.mock("../hooks/useVets", () => ({
  useVets: vi.fn(),
}));

describe("AddAppointmentDialog", () => {
  it("derives pet, owner, and veterinarian details and submits the appointment", async () => {
    vi.mocked(usePets).mockReturnValue({
      pets: [
        {
          petId: 16,
          petName: "Nala",
          ownerId: 8,
          ownerName: "Tatjana Klatyik",
          birthdate: new Date("2023-01-01"),
          age: 3,
          sex: "female",
          color: "white",
          microchip_no: 12346,
          weight: 4,
          pet_typeId: 1,
          breed_id: 1,
        },
        {
          petId: 15,
          petName: "Minnie Mouse",
          ownerId: 8,
          ownerName: "Tatjana Klatyik",
          birthdate: new Date("2023-01-01"),
          age: 3,
          sex: "female",
          color: "white",
          microchip_no: 12345,
          weight: 4,
          pet_typeId: 1,
          breed_id: 1,
        },
        {
          petId: 17,
          petName: "Bella",
          ownerId: 18,
          ownerName: "Tatjana Klatyik",
          birthdate: new Date("2023-01-01"),
          age: 3,
          sex: "female",
          color: "white",
          microchip_no: 12347,
          weight: 4,
          pet_typeId: 1,
          breed_id: 1,
        },
      ],
      loading: false,
      error: "",
      loadPets: vi.fn(),
    });
    vi.mocked(useOwners).mockReturnValue({
      owners: [
        {
          ownerId: 8,
          firstName: "Tatjana",
          lastName: "Klatyik",
          email: "tatjana@example.com",
          phone: "123",
        },
        {
          ownerId: 9,
          firstName: "Marta",
          lastName: "Auer",
          email: "marta@example.com",
          phone: "456",
        },
        {
          ownerId: 18,
          firstName: " tatjana ",
          lastName: "klatyik ",
          email: "tatjana-duplicate@example.com",
          phone: "789",
        },
      ],
      loading: false,
      error: false,
      reloadOwners: vi.fn(),
    });
    vi.mocked(useVets).mockReturnValue({
      vets: [
        {
          vetId: 3,
          firstName: "Ada",
          lastName: "Smith",
        },
      ],
      loading: false,
      error: null,
      reloadVets: vi.fn(),
    });
    vi.mocked(createAppointment).mockResolvedValue({
      appointmentId: 1,
      petId: 15,
      vetId: 3,
      appointmentDate: "2026-11-25T09:00:00.000Z",
      reason: "Vaccination",
      status: "SCHEDULED",
      notes: "Bring records",
    });

    const onClose = vi.fn();
    const onCreated = vi.fn();
    render(
      <AddAppointmentDialog
        open
        onClose={onClose}
        onCreated={onCreated}
      />,
    );

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Owner" }));
    const ownerOptions = await screen.findAllByRole("option");
    expect(ownerOptions.map((option) => option.textContent)).toEqual([
      "Auer, Marta — 9",
      "Klatyik, Tatjana — 8",
    ]);
    fireEvent.click(ownerOptions[1]);

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Patient" }));
    const patientOptions = await screen.findAllByRole("option");
    expect(patientOptions.map((option) => option.textContent)).toEqual([
      "17 — Bella",
      "15 — Minnie Mouse",
      "16 — Nala",
    ]);
    fireEvent.click(await screen.findByRole("option", { name: /15 — Minnie Mouse/ }));
    expect(screen.getByLabelText("Owner ID")).toHaveValue("8");
    expect(screen.getByLabelText("Owner name")).toHaveValue("Tatjana Klatyik");

    fireEvent.mouseDown(
      screen.getByRole("combobox", { name: "Veterinarian" }),
    );
    fireEvent.click(await screen.findByRole("option", { name: /3 — Ada Smith/ }));
    expect(screen.getByLabelText("Veterinarian name")).toHaveValue("Ada Smith");

    fireEvent.change(screen.getByLabelText(/Date/), {
      target: { value: "2026-11-25" },
    });
    fireEvent.change(screen.getByLabelText(/Time/), {
      target: { value: "10:00" },
    });
    fireEvent.mouseDown(
      screen.getByRole("combobox", { name: "Visit reason" }),
    );
    fireEvent.click(await screen.findByRole("option", { name: "Other" }));
    fireEvent.change(await screen.findByLabelText(/Specify reason/), {
      target: { value: "Examinacion defecacion" },
    });
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "Bring records" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledWith({
        petId: 15,
        vetId: 3,
        appointmentDate: new Date("2026-11-25T10:00").toISOString(),
        reason: "Examinacion defecacion",
        status: "SCHEDULED",
        notes: "Bring records",
      });
    });
    expect(onCreated).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("requires an owner before a patient can be selected", async () => {
    vi.mocked(usePets).mockReturnValue({
      pets: [],
      loading: false,
      error: "",
      loadPets: vi.fn(),
    });
    vi.mocked(useOwners).mockReturnValue({
      owners: [],
      loading: false,
      error: false,
      reloadOwners: vi.fn(),
    });
    vi.mocked(useVets).mockReturnValue({
      vets: [],
      loading: false,
      error: null,
      reloadVets: vi.fn(),
    });

    render(
      <AddAppointmentDialog
        open
        onClose={vi.fn()}
        onCreated={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", { name: "Patient" }),
    ).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(
      await screen.findByText(
        "Selecciona propietario, paciente, veterinario, fecha, hora y motivo.",
      ),
    ).toBeInTheDocument();
  });
});
