import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import type { AppointmentStatus } from "../types/Appointment";
import { createAppointment } from "../types/appointments";
import { usePets } from "../hooks/usePets";
import { useVets } from "../hooks/useVets";
import type { Pet } from "../types/Pet";
import type { Vet } from "../types/Vet";

interface AddAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const appointmentReasons = [
  "Check-up",
  "Vaccination",
  "Illness",
  "Injury",
  "Follow-up",
  "Dental care",
  "Surgery",
  "Other",
];

const appointmentStatuses: AppointmentStatus[] = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
];

function getOwnerName(pet: Pet | undefined): string {
  return (
    pet?.ownerName ??
    [pet?.ownerFirstName, pet?.ownerLastName].filter(Boolean).join(" ")
  );
}

function getVetName(vet: Vet | undefined): string {
  if (!vet) return "";
  return (
    vet.name ??
    [vet.firstName ?? vet.first_name, vet.lastName ?? vet.last_name]
      .filter(Boolean)
      .join(" ")
  );
}

function AppointmentForm({
  onClose,
  onCreated,
}: Omit<AddAppointmentDialogProps, "open">) {
  const { pets, loading: petsLoading, error: petsError } = usePets();
  const { vets, loading: vetsLoading, error: vetsError } = useVets();
  const [petId, setPetId] = useState("");
  const [vetId, setVetId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("SCHEDULED");
  const [notes, setNotes] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedPet = pets.find((pet) => String(pet.petId) === petId);
  const selectedVet = vets.find((vet) => String(vet.vetId) === vetId);
  const ownerName = getOwnerName(selectedPet);
  const submittedReason = reason === "Other" ? otherReason.trim() : reason;

  const handleSubmit = async () => {
    if (!selectedPet || !selectedVet || !date || !time || !submittedReason) {
      setValidationMessage(
        "Selecciona paciente, veterinario, fecha, hora y motivo.",
      );
      return;
    }

    const appointmentDate = new Date(`${date}T${time}`);
    if (Number.isNaN(appointmentDate.getTime())) {
      setValidationMessage("Introduce una fecha y hora válidas.");
      return;
    }

    setValidationMessage("");
    setErrorMessage("");
    setIsSaving(true);
    try {
      await createAppointment({
        petId: selectedPet.petId,
        vetId: selectedVet.vetId,
        appointmentDate: appointmentDate.toISOString(),
        reason: submittedReason,
        status,
        notes: notes.trim() || undefined,
      });
      onCreated();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo crear la cita.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const loading = petsLoading || vetsLoading;
  const loadError = petsError || vetsError;

  return (
    <Dialog
      open
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Add appointment</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            pt: 1,
          }}
        >
          {loadError && (
            <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>
              {loadError}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>
              {errorMessage}
            </Alert>
          )}
          {validationMessage && (
            <Alert severity="warning" sx={{ gridColumn: "1 / -1" }}>
              {validationMessage}
            </Alert>
          )}
          <TextField
            select
            label="Patient"
            value={petId}
            onChange={(event) => setPetId(event.target.value)}
            disabled={loading || Boolean(petsError)}
            required
          >
            {pets.map((pet) => (
              <MenuItem key={pet.petId} value={String(pet.petId)}>
                {pet.petId} — {pet.petName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Pet ID"
            value={selectedPet?.petId ?? ""}
            disabled
          />
          <TextField
            label="Pet name"
            value={selectedPet?.petName ?? ""}
            disabled
          />
          <TextField
            label="Owner ID"
            value={selectedPet?.ownerId ?? ""}
            disabled
          />
          <TextField label="Owner name" value={ownerName} disabled />
          <TextField
            select
            label="Veterinarian"
            value={vetId}
            onChange={(event) => setVetId(event.target.value)}
            disabled={loading || Boolean(vetsError)}
            required
          >
            {vets.map((vet) => (
              <MenuItem key={vet.vetId} value={String(vet.vetId)}>
                {vet.vetId} — {getVetName(vet)}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Vet ID" value={selectedVet?.vetId ?? ""} disabled />
          <TextField
            label="Veterinarian name"
            value={getVetName(selectedVet)}
            disabled
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            select
            label="Visit reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
          >
            {appointmentReasons.map((appointmentReason) => (
              <MenuItem key={appointmentReason} value={appointmentReason}>
                {appointmentReason}
              </MenuItem>
            ))}
          </TextField>
          {reason === "Other" && (
            <TextField
              label="Specify reason"
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              required
            />
          )}
          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) => {
              const value = event.target.value;
              if (
                value === "SCHEDULED" ||
                value === "COMPLETED" ||
                value === "CANCELLED"
              ) {
                setStatus(value);
              }
            }}
            required
          >
            {appointmentStatuses.map((appointmentStatus) => (
              <MenuItem key={appointmentStatus} value={appointmentStatus}>
                {appointmentStatus}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            multiline
            minRows={2}
            sx={{ gridColumn: "1 / -1" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={() => void handleSubmit()}
          disabled={isSaving || loading || Boolean(loadError)}
          variant="contained"
        >
          {isSaving ? "Saving..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AddAppointmentDialog({
  open,
  onClose,
  onCreated,
}: AddAppointmentDialogProps) {
  return open ? (
    <AppointmentForm onClose={onClose} onCreated={onCreated} />
  ) : null;
}
