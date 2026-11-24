import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { VisitListItem } from "../types/Visit";

interface VisitsListProps {
  visits: VisitListItem[];
}

function formatVisitDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function VisitsList({ visits }: VisitsListProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Visits">
        <TableHead>
          <TableRow>
            <TableCell>Visit ID</TableCell>
            <TableCell>Appointment ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Veterinarian</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Visit status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.visitId} hover>
              <TableCell>{visit.visitId}</TableCell>
              <TableCell>{visit.appointmentId ?? "—"}</TableCell>
              <TableCell>{formatVisitDate(visit.visitDate)}</TableCell>
              <TableCell>{visit.petName ?? "—"}</TableCell>
              <TableCell>{visit.ownerName ?? "—"}</TableCell>
              <TableCell>{visit.vet ?? "—"}</TableCell>
              <TableCell>{visit.reason}</TableCell>
              <TableCell>{visit.visitStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
