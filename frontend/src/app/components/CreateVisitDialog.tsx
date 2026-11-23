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
  Typography,
} from "@mui/material";
import {
  APPOINTMENT_REASONS,
  APPOINTMENT_STATUSES,
  type Appointment,
  type AppointmentStatus,
} from "../types/Appointment";
import { VISIT_STATUSES, type VisitStatus } from "../types/Visit";
import { createVisit } from "../types/visits";
import {
  getLocalDateTimeISOString,
  getLocalDateTimeValues,
} from "../shared/utils/appointment-date-time";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

interface CreateVisitDialogProps {
  open: boolean;
  appointment: Appointment;
  onClose: () => void;
  onCreated: () => Promise<void>;
}

export default function CreateVisitDialog({
  open,
  appointment,
  onClose,
  onCreated,
}: CreateVisitDialogProps) {
  const initialDateTime = getLocalDateTimeValues(appointment.appointmentDate);
  const [date, setDate] = useState(initialDateTime.date);
  const [time, setTime] = useState(initialDateTime.time);
  const [appointmentReason, setAppointmentReason] = useState(
    appointment.reason,
  );
  const [appointmentStatus, setAppointmentStatus] =
    useState<AppointmentStatus>(appointment.status);
  const [appointmentNotes, setAppointmentNotes] = useState(
    appointment.notes ?? "",
  );
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medication, setMedication] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [indication, setIndication] = useState("");
  const [status, setStatus] = useState<VisitStatus>("SCHEDULED");
  const [visitId, setVisitId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isDisabled = isSaving || visitId !== null;

  const handleSave = async () => {
    const appointmentDate = getLocalDateTimeISOString(date, time);
    if (!appointmentDate || !appointmentReason.trim() || !reason.trim()) {
      setErrorMessage("Introduce una fecha, hora y motivo de visita válidos.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const createdVisit = await createVisit(appointment.appointmentId, {
        appointment: {
          appointmentDate,
          reason: appointmentReason.trim(),
          status: appointmentStatus,
          notes: appointmentNotes.trim(),
        },
        reason: reason.trim(),
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        medication: medication.trim(),
        visitNotes: visitNotes.trim(),
        indication: indication.trim(),
        status,
      });
      setVisitId(createdVisit.visitId);
      setSuccessMessage(`Visit ${createdVisit.visitId} created.`);

      try {
        await onCreated();
      } catch {
        setErrorMessage(
          "Visit created, but the appointment details could not be refreshed.",
        );
      }
    } catch (error) {
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "No se pudo crear la visita. Inténtalo de nuevo.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSaving) onClose();
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Crear Visit</DialogTitle>
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
          <Typography variant="subtitle1" sx={{ gridColumn: "1 / -1" }}>
            Appointment details
          </Typography>
          <TextField
            label="Appointment ID"
            value={appointment.appointmentId}
            disabled
          />
          <TextField
            label="Patient"
            value={appointment.petName ?? "—"}
            disabled
          />
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
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            disabled={isDisabled}
            required
          />
          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            disabled={isDisabled}
            required
          />
          <TextField
            select
            label="Appointment reason"
            value={appointmentReason}
            onChange={(event) => setAppointmentReason(event.target.value)}
            disabled={isDisabled}
            required
          >
            {!APPOINTMENT_REASONS.some(
              (appointmentOption) => appointmentOption === appointment.reason,
            ) && (
              <MenuItem value={appointment.reason}>
                {appointment.reason}
              </MenuItem>
            )}
            {APPOINTMENT_REASONS.map((appointmentOption) => (
              <MenuItem key={appointmentOption} value={appointmentOption}>
                {appointmentOption}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Appointment status"
            value={appointmentStatus}
            onChange={(event) => {
              const nextStatus = APPOINTMENT_STATUSES.find(
                (appointmentOption) => appointmentOption === event.target.value,
              );
              if (nextStatus) setAppointmentStatus(nextStatus);
            }}
            disabled={isDisabled}
            required
          >
            {APPOINTMENT_STATUSES.map((appointmentOption) => (
              <MenuItem key={appointmentOption} value={appointmentOption}>
                {appointmentOption}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Appointment notes"
            value={appointmentNotes}
            onChange={(event) => setAppointmentNotes(event.target.value)}
            multiline
            minRows={2}
            sx={{ gridColumn: "1 / -1" }}
            disabled={isDisabled}
          />
          <Typography variant="subtitle1" sx={{ gridColumn: "1 / -1" }}>
            Visit details
          </Typography>
          <TextField
            label="Visit ID"
            value={visitId ?? ""}
            placeholder="Assigned when saved"
            disabled
          />
          <TextField
            label="Billing ID"
            value=""
            placeholder="Not assigned"
            disabled
          />
          <TextField
            label="Motivo"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={isDisabled}
            required
          />
          <TextField
            select
            label="Visit status"
            value={status}
            onChange={(event) => {
              const nextStatus = VISIT_STATUSES.find(
                (visitStatus) => visitStatus === event.target.value,
              );
              if (nextStatus) setStatus(nextStatus);
            }}
            disabled={isDisabled}
            required
          >
            {VISIT_STATUSES.map((visitStatus) => (
              <MenuItem key={visitStatus} value={visitStatus}>
                {visitStatus}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Diagnóstico"
            value={diagnosis}
            onChange={(event) => setDiagnosis(event.target.value)}
            disabled={isDisabled}
            multiline
            minRows={2}
          />
          <TextField
            label="Tratamiento"
            value={treatment}
            onChange={(event) => setTreatment(event.target.value)}
            disabled={isDisabled}
            multiline
            minRows={2}
          />
          <TextField
            label="Medicación"
            value={medication}
            onChange={(event) => setMedication(event.target.value)}
            disabled={isDisabled}
            multiline
            minRows={2}
          />
          <TextField
            label="Indicación"
            value={indication}
            onChange={(event) => setIndication(event.target.value)}
            disabled={isDisabled}
            multiline
            minRows={2}
          />
          <TextField
            label="Visit notes"
            value={visitNotes}
            onChange={(event) => setVisitNotes(event.target.value)}
            disabled={isDisabled}
            multiline
            minRows={2}
            sx={{ gridColumn: "1 / -1" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          {visitId === null ? "Cancel" : "Close"}
        </Button>
        {visitId === null && (
          <Button
            onClick={() => void handleSave()}
            disabled={isSaving}
            variant="contained"
          >
            {isSaving ? "Saving..." : "Save Visit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
