import { useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PetsIcon from "@mui/icons-material/Pets";
import { useOwners } from "../../../hooks/useOwners";

type OwnersPageProps = {
  onGoHome: () => void;
};

export const OwnersPage = ({ onGoHome }: OwnersPageProps) => {
  const { owners, loading, error } = useOwners();

  const summary = useMemo(
    () => ({
      totalOwners: owners.length,
      activePets: owners.reduce((count, owner) => count + (owner.ownerId > 0 ? 1 : 0), 0),
    }),
    [owners]
  );

  if (loading) {
    return <Typography>Cargando propietarios...</Typography>;
  }

  if (error) {
    return <Typography>Error al cargar propietarios.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Button variant="outlined" startIcon={<HomeIcon />} onClick={onGoHome}>
          Home
        </Button>
        <Typography variant="h4">Propietarios</Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        <Card>
          <CardContent>
            <PeopleIcon color="primary" />
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
              {summary.totalOwners}
            </Typography>
            <Typography color="text.secondary">Owners registered</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <PetsIcon color="success" />
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
              {summary.activePets}
            </Typography>
            <Typography color="text.secondary">Active pets</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {owners.map((owner) => (
          <Card key={owner.ownerId}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {owner.firstName} {owner.lastName}
              </Typography>
              <Typography color="text.secondary">{owner.email}</Typography>
              <Typography color="text.secondary">{owner.phone}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default OwnersPage;
