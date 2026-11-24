import { Alert, Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import VisitsList from "../components/VisitsList";
import { useVisits } from "../hooks/useVisits";

export default function FollowUpsPage() {
  const { visits, loading, error } = useVisits();
  const followUps = visits.filter(
    (visit) => visit.visitStatus === "FOLLOW_UP_REQUIRED",
  );

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
        <Typography variant="h4">Follow-Ups</Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Typography role="status">Loading follow-ups...</Typography>
      ) : error ? null : followUps.length === 0 ? (
        <Typography>No follow-ups required.</Typography>
      ) : (
        <VisitsList visits={followUps} />
      )}
    </Box>
  );
}
