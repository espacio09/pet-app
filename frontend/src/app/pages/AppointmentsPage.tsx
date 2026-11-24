import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppointments } from "../hooks/useAppointments";
import AddAppointmentDialog from "../components/AddAppointmentDialog";
import AppointmentDetailsDialog from "../components/AppointmentDetailsDialog";
import { deleteAppointments } from "../types/appointments";
import type { Appointment } from "../types/Appointment";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";
import { useState } from "react";

function formatAppointmentDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function AppointmentsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState<
    number[]
  >([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    appointments,
    loading: isLoading,
    error: errorMessage,
    reloadAppointments,
  } = useAppointments();
  const selectedAppointments = appointments.filter((appointment) =>
    selectedAppointmentIds.includes(appointment.appointmentId),
  );

  const handleDeleteAppointment = async () => {
    const appointmentIds = selectedAppointments.map(
      (appointment) => appointment.appointmentId,
    );
    if (appointmentIds.length === 0) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteAppointments(appointmentIds);
    } catch (error) {
      setDeleteError(
        getUserFacingErrorMessage(
          error,
          "No se pudieron eliminar las citas. Inténtalo de nuevo.",
        ),
      );
      setIsDeleting(false);
      return;
    }

    setSelectedAppointmentIds([]);
    if (
      selectedAppointment &&
      appointmentIds.includes(selectedAppointment.appointmentId)
    ) {
      setSelectedAppointment(null);
      setIsDetailsDialogOpen(false);
    }
    setIsDeleteDialogOpen(false);
    setIsDeleting(false);
    await reloadAppointments().catch(() => undefined);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Button component={Link} to="/" variant="outlined">
              Home
            </Button>
            <Button component={Link} to="/visits" variant="outlined">
              Visits
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAddDialogOpen(true)}
              disabled={isLoading}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setDeleteError("");
                setIsDeleteDialogOpen(true);
              }}
              disabled={selectedAppointments.length === 0 || isDeleting}
            >
              Delete
            </Button>
          </Box>
          <Typography variant="h4">Appointments</Typography>
        </Box>
      </Box>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isLoading ? (
        <Typography role="status">Loading appointments...</Typography>
      ) : errorMessage ? null : appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="Appointments">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Veterinarian</TableCell>
                <TableCell sx={{ minWidth: 180, maxWidth: 260 }}>
                  Reason
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.appointmentId}
                  hover
                  selected={
                    selectedAppointmentIds.includes(
                    appointment.appointmentId,
                    ) ||
                    selectedAppointment?.appointmentId ===
                    appointment.appointmentId
                  }
                  tabIndex={0}
                  aria-label={`Open appointment ${appointment.appointmentId} details`}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsDetailsDialogOpen(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedAppointment(appointment);
                      setIsDetailsDialogOpen(true);
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAppointmentIds.includes(
                        appointment.appointmentId,
                      )}
                      slotProps={{
                        input: {
                          "aria-label": `Select appointment ${appointment.appointmentId}`,
                        },
                      }}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setSelectedAppointmentIds((ids) =>
                          checked
                            ? [...ids, appointment.appointmentId]
                            : ids.filter(
                                (id) => id !== appointment.appointmentId,
                              ),
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {formatAppointmentDate(appointment.appointmentDate)}
                  </TableCell>
                  <TableCell>{appointment.petName ?? "—"}</TableCell>
                  <TableCell>{appointment.ownerName ?? "—"}</TableCell>
                  <TableCell>{appointment.vet ?? "—"}</TableCell>
                  <TableCell
                    sx={{
                      minWidth: 180,
                      maxWidth: 260,
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {appointment.reason}
                  </TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AddAppointmentDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onCreated={() => {
          void reloadAppointments().catch(() => undefined);
        }}
      />
      <AppointmentDetailsDialog
        open={isDetailsDialogOpen}
        appointment={selectedAppointment}
        onClose={() => setIsDetailsDialogOpen(false)}
        onSaved={async () => {
          const appointmentId = selectedAppointment?.appointmentId;
          const refreshedAppointments = await reloadAppointments();
          if (appointmentId === undefined) return;

          const updatedAppointment = refreshedAppointments.find(
            (appointment) => appointment.appointmentId === appointmentId,
          );
          if (updatedAppointment) setSelectedAppointment(updatedAppointment);
        }}
      />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          if (!isDeleting) setIsDeleteDialogOpen(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete appointments</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete these appointments?
          </Typography>
          <Box
            component="ul"
            sx={{ maxHeight: "50vh", overflowY: "auto", pl: 3, mb: 0 }}
          >
            {selectedAppointments.map((appointment) => (
              <li key={appointment.appointmentId}>
                <Typography component="span">
                  {formatAppointmentDate(appointment.appointmentDate)} ·{" "}
                  {appointment.petName ?? "—"} ·{" "}
                  {appointment.ownerName ?? "—"} · {appointment.vet ?? "—"} ·{" "}
                  {appointment.reason} · {appointment.status}
                </Typography>
              </li>
            ))}
          </Box>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            No
          </Button>
          <Button
            onClick={() => void handleDeleteAppointment()}
            disabled={selectedAppointments.length === 0 || isDeleting}
            color="error"
            variant="contained"
          >
            {isDeleting ? "Deleting..." : "Yes, delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
