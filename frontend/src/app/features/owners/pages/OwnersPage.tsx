import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddOwnerDialog from "../../../components/AddOwnerDialog";
import OwnerDetailModal from "../../../components/OwnerDetailModal";
import OwnersList from "../../../components/OwnersList";
import type { Owner } from "../../../types/Owner";
import { deleteOwners } from "../../../types/owners";
import { useOwners } from "../../../hooks/useOwners";

type OwnersPageProps = {
  onGoHome: () => void;
};

export const OwnersPage = ({ onGoHome }: OwnersPageProps) => {
  const { owners, loading, error, reloadOwners } = useOwners();
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [selectedDeleteOwnerIds, setSelectedDeleteOwnerIds] = useState<number[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const selectedDeleteOwners = owners.filter((owner) =>
    selectedDeleteOwnerIds.includes(owner.ownerId),
  );

  const handleOwnerSaved = async () => {
    if (!selectedOwner) return;

    const refreshedOwners = await reloadOwners();
    setSelectedOwner(
      refreshedOwners.find((owner) => owner.ownerId === selectedOwner.ownerId) ?? null,
    );
  };

  const handleDeleteOwner = async () => {
    if (selectedDeleteOwnerIds.length === 0) return;

    setDeleting(true);
    setDeleteError("");
    try {
      await deleteOwners(selectedDeleteOwnerIds);
      await reloadOwners();
      setSelectedOwner(null);
      setSelectedDeleteOwnerIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "No se pudo eliminar el propietario.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Typography>Cargando propietarios...</Typography>;
  }

  if (error) {
    return <Typography>Error al cargar propietarios.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Button variant="outlined" startIcon={<HomeIcon />} onClick={onGoHome}>
            Home
          </Button>
          <Typography variant="h4">Propietarios</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            disabled={selectedDeleteOwnerIds.length === 0}
            onClick={() => {
              setDeleteError("");
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {owners.length} propietarios registrados
      </Typography>

      <OwnersList
        owners={owners}
        onSelect={setSelectedOwner}
        selectedOwnerIds={selectedDeleteOwnerIds}
        onSelectionChange={setSelectedDeleteOwnerIds}
      />

      <AddOwnerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdded={async () => {
          await reloadOwners();
        }}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleting) setDeleteDialogOpen(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Eliminar propietario</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedDeleteOwners.length === 1
              ? `¿Quieres eliminar a ${selectedDeleteOwners[0].firstName ?? selectedDeleteOwners[0].first_name} ${selectedDeleteOwners[0].lastName ?? selectedDeleteOwners[0].last_name}?`
              : `¿Quieres eliminar a los ${selectedDeleteOwners.length} propietarios seleccionados?`}
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            No
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDeleteOwner()}
            disabled={deleting || selectedDeleteOwnerIds.length === 0}
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

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
