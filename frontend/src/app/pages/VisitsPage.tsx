import {
  Alert,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useVisits } from "../hooks/useVisits";
import VisitsList from "../components/VisitsList";

export default function VisitsPage() {
  const { visits, loading, error } = useVisits();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button component={Link} to="/" variant="outlined">
            Home
          </Button>
          <Button component={Link} to="/appointments" variant="outlined">
            Appointments
          </Button>
          <Button component={Link} to="/billing" variant="outlined">
            Billing
          </Button>
        </Box>
        <Typography variant="h4">Visits</Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Typography role="status">Loading visits...</Typography>
      ) : error ? null : visits.length === 0 ? (
        <Typography>No visits found.</Typography>
      ) : (
        <VisitsList visits={visits} />
      )}
    </Box>
  );
}
