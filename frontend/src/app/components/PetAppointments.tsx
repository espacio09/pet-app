import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { Appointment, AppointmentStatus } from "../types/Appointment";
import { createAppointment, getPetAppointments } from "../types/appointments";
import { getVets } from "../types/vets";
import type { VetApi } from "../types/Vet";

interface PetAppointmentsProps {
  petId: number;
}

function getVetId(vet: VetApi): number | undefined {
  return vet.vetId ?? vet.id;
}

function getVetName(vet: VetApi): string {
  return (
    vet.name ??
    [vet.firstName ?? vet.first_name, vet.lastName ?? vet.last_name]
      .filter(Boolean)
      .join(" ")
  );
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

export default function PetAppointments({ petId }: PetAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vets, setVets] = useState<VetApi[]>([]);
  const [vetId, setVetId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("SCHEDULED");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const loadAppointments = useCallback(async () => {
    const result = await getPetAppointments(petId);
    setAppointments(result);
  }, [petId]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setErrorMessage("");

    void Promise.all([getPetAppointments(petId), getVets()])
      .then(([loadedAppointments, loadedVets]) => {
        if (cancelled) return;
        setAppointments(loadedAppointments);
        setVets(loadedVets);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las citas.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [petId]);

  const handleCreateAppointment = async () => {
    if (!vetId || !appointmentDate || !reason.trim()) {
      setValidationMessage(
        "Selecciona un veterinario, una fecha y un motivo para la cita.",
      );
      return;
    }

    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime())) {
      setValidationMessage("Introduce una fecha válida.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setValidationMessage("");
    try {
      await createAppointment({
        petId,
        vetId: Number(vetId),
        appointmentDate: date.toISOString(),
        reason: reason.trim(),
        status,
      });
      await loadAppointments();
      setAppointmentDate("");
      setReason("");
      setStatus("SCHEDULED");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo crear la cita.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
        Appointments
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {errorMessage}
        </Alert>
      )}
      {validationMessage && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          {validationMessage}
        </Alert>
      )}
      {isLoading ? (
        <Typography role="status">Loading appointments...</Typography>
      ) : appointments.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          No appointments yet.
        </Typography>
      ) : (
        <List dense disablePadding sx={{ mb: 1 }}>
          {appointments.map((appointment) => (
            <ListItem key={appointment.appointmentId} disableGutters>
              <ListItemText
                primary={`${formatAppointmentDate(appointment.appointmentDate)} · ${appointment.vet ?? "Veterinarian"}`}
                secondary={`${appointment.reason} · ${appointment.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 1,
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id={`appointment-vet-label-${petId}`}>
            Veterinarian
          </InputLabel>
          <Select
            labelId={`appointment-vet-label-${petId}`}
            label="Veterinarian"
            value={vetId}
            onChange={(event: SelectChangeEvent) => setVetId(event.target.value)}
          >
            {vets.map((vet) => {
              const id = getVetId(vet);
              return id === undefined ? null : (
                <MenuItem key={id} value={String(id)}>
                  {getVetName(vet)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          label="Appointment date"
          type="datetime-local"
          value={appointmentDate}
          onChange={(event) => setAppointmentDate(event.target.value)}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          size="small"
          fullWidth
        />
        <FormControl fullWidth size="small">
          <InputLabel id={`appointment-status-label-${petId}`}>
            Status
          </InputLabel>
          <Select
            labelId={`appointment-status-label-${petId}`}
            label="Status"
            value={status}
            onChange={(event: SelectChangeEvent<AppointmentStatus>) => {
              const value = event.target.value;
              if (
                value === "SCHEDULED" ||
                value === "COMPLETED" ||
                value === "CANCELLED"
              ) {
                setStatus(value);
              }
            }}
          >
            <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        onClick={() => void handleCreateAppointment()}
        disabled={isSaving || isLoading || vets.length === 0}
        variant="contained"
        sx={{ mt: 1 }}
      >
        {isSaving ? "Saving..." : "Create appointment"}
      </Button>
    </Box>
  );
}
