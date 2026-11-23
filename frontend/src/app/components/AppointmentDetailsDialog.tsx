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
import { useState } from "react";
import {
  APPOINTMENT_REASONS,
  APPOINTMENT_STATUSES,
  type Appointment,
  type AppointmentStatus,
} from "../types/Appointment";
import { updateAppointment } from "../types/appointments";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";
import {
  getLocalDateTimeISOString,
  getLocalDateTimeValues,
} from "../shared/utils/appointment-date-time";
import CreateVisitDialog from "./CreateVisitDialog";

interface AppointmentDetailsDialogProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function formatAppointmentDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function AppointmentDetailsDialog({
  open,
  appointment,
  onClose,
  onSaved,
}: AppointmentDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("SCHEDULED");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateVisitOpen, setIsCreateVisitOpen] = useState(false);

  if (!open || !appointment) return null;

  const handleStartEditing = () => {
    const appointmentDate = getLocalDateTimeValues(
      appointment.appointmentDate,
    );
    setDate(appointmentDate.date);
    setTime(appointmentDate.time);
    setReason(appointment.reason);
    setStatus(appointment.status);
    setNotes(appointment.notes ?? "");
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleSave = async () => {
    const trimmedReason = reason.trim();
    const appointmentDate = getLocalDateTimeISOString(date, time);

    if (!trimmedReason || !appointmentDate) {
      setErrorMessage("Introduce una fecha, hora y motivo válidos.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    try {
      await updateAppointment(appointment.appointmentId, {
        appointmentDate,
        reason: trimmedReason,
        status,
        notes: notes.trim(),
      });
      await onSaved();
      setIsEditing(false);
      setSuccessMessage("Appointment changes saved.");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "No se pudo actualizar la cita. Inténtalo de nuevo.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setIsEditing(false);
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateVisitOpen(false);
    onClose();
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Appointment details</DialogTitle>
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
          {errorMessage && (
            <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ gridColumn: "1 / -1" }}>
              {successMessage}
            </Alert>
          )}
          <TextField
            label="Appointment ID"
            value={appointment.appointmentId}
            disabled
          />
          <TextField label="Patient" value={appointment.petName ?? "—"} disabled />
          <TextField label="Pet ID" value={appointment.petId} disabled />
          <TextField
            label="Owner name"
            value={appointment.ownerName ?? "—"}
            disabled
          />
          <TextField
            label="Veterinarian"
            value={appointment.vet ?? "—"}
            disabled
          />
          <TextField label="Vet ID" value={appointment.vetId} disabled />
          {isEditing ? (
            <>
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
                sx={{ gridColumn: "1 / -1" }}
                required
              >
                {!APPOINTMENT_REASONS.some(
                  (appointmentReason) =>
                    appointmentReason === appointment.reason,
                ) && (
                  <MenuItem value={appointment.reason}>
                    {appointment.reason}
                  </MenuItem>
                )}
                {APPOINTMENT_REASONS.map((appointmentReason) => (
                  <MenuItem key={appointmentReason} value={appointmentReason}>
                    {appointmentReason}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Status"
                value={status}
                onChange={(event) => {
                  const nextStatus = APPOINTMENT_STATUSES.find(
                    (appointmentStatus) =>
                      appointmentStatus === event.target.value,
                  );
                  if (nextStatus) setStatus(nextStatus);
                }}
                required
              >
                {APPOINTMENT_STATUSES.map((appointmentStatus) => (
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
            </>
          ) : (
            <>
              <TextField
                label="Date and time"
                value={formatAppointmentDate(appointment.appointmentDate)}
                disabled
              />
              <TextField
                label="Visit reason"
                value={appointment.reason}
                disabled
              />
              <TextField label="Status" value={appointment.status} disabled />
              <TextField
                label="Notes"
                value={appointment.notes ?? ""}
                disabled
                multiline
                minRows={2}
                sx={{ gridColumn: "1 / -1" }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          onClick={() => setIsCreateVisitOpen(true)}
          disabled={isEditing || isSaving}
        >
          Crear Visit
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleSave()}
                disabled={isSaving}
                variant="contained"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleStartEditing} variant="contained">
                Edit
              </Button>
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
    {isCreateVisitOpen && (
      <CreateVisitDialog
        open
        appointment={appointment}
        onClose={() => setIsCreateVisitOpen(false)}
        onCreated={onSaved}
      />
    )}
    </>
  );
}
