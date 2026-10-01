import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import OwnerDetailModal from "../../../components/OwnerDetailModal";
import OwnersList from "../../../components/OwnersList";
import type { Owner } from "../../../types/Owner";
import { useOwners } from "../../../hooks/useOwners";

type OwnersPageProps = {
  onGoHome: () => void;
};

export const OwnersPage = ({ onGoHome }: OwnersPageProps) => {
  const { owners, loading, error, reloadOwners } = useOwners();
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const handleOwnerSaved = async () => {
    if (!selectedOwner) return;

    const refreshedOwners = await reloadOwners();
    setSelectedOwner(
      refreshedOwners.find((owner) => owner.ownerId === selectedOwner.ownerId) ?? null,
    );
  };

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

      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {owners.length} propietarios registrados
      </Typography>

      <OwnersList owners={owners} onSelect={setSelectedOwner} />

      <OwnerDetailModal
        open={selectedOwner !== null}
        onClose={() => setSelectedOwner(null)}
        onSaved={handleOwnerSaved}
        owner={selectedOwner}
      />
    </Box>
  );
};

export default OwnersPage;
