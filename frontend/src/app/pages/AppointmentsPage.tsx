import {
  Alert,
  Box,
  Button,
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
  const {
    appointments,
    loading: isLoading,
    error: errorMessage,
    reloadAppointments,
  } = useAppointments();

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
          <Button component={Link} to="/" variant="outlined" sx={{ mb: 1 }}>
            Home
          </Button>
          <Typography variant="h4">Appointments</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
          disabled={isLoading}
        >
          Add
        </Button>
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
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Veterinarian</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell>
                    {formatAppointmentDate(appointment.appointmentDate)}
                  </TableCell>
                  <TableCell>{appointment.petName ?? "—"}</TableCell>
                  <TableCell>{appointment.ownerName ?? "—"}</TableCell>
                  <TableCell>{appointment.vet ?? "—"}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
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
    </Box>
  );
}
