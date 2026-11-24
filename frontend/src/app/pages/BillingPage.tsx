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
import { useBillings } from "../hooks/useBillings";

function formatVisitDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function BillingPage() {
  const { billings, loading, error } = useBillings();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button component={Link} to="/" variant="outlined">
            Home
          </Button>
          <Button component={Link} to="/visits" variant="outlined">
            Visits
          </Button>
        </Box>
        <Typography variant="h4">Billing</Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Typography role="status">Loading billings...</Typography>
      ) : error ? null : billings.length === 0 ? (
        <Typography>No billings found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="Billings">
            <TableHead>
              <TableRow>
                <TableCell>Billing ID</TableCell>
                <TableCell>Visit ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Billing status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billings.map((billing) => (
                <TableRow key={billing.billingId} hover>
                  <TableCell>{billing.billingId}</TableCell>
                  <TableCell>{billing.visitId}</TableCell>
                  <TableCell>{formatVisitDate(billing.visitDate)}</TableCell>
                  <TableCell>{billing.petName ?? "—"}</TableCell>
                  <TableCell>{billing.ownerName ?? "—"}</TableCell>
                  <TableCell>{billing.reason}</TableCell>
                  <TableCell>{billing.billingStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
