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
  TextField,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import AddVetDialog from "../../../components/AddVetDialog";
import VetDetailModal from "../../../components/VetDetailModal";
import VetsList from "../../../components/VetsList";
import type { Vet } from "../../../types/Vet";
import { deleteVet } from "../../../types/vets";
import { useVets } from "../../../hooks/useVets";
import { getUserFacingErrorMessage } from "../../../shared/utils/user-facing-error";

export default function VetsPage() {
  const { vets, loading, error, reloadVets } = useVets();
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [selectedVetIds, setSelectedVetIds] = useState<number[]>([]);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const normalizedFirstNameSearch = searchFirstName.trim().toLocaleLowerCase();
  const normalizedLastNameSearch = searchLastName.trim().toLocaleLowerCase();
  const filteredVets = vets.filter((vet) => {
    const firstName = (vet.firstName ?? vet.first_name ?? "").toLocaleLowerCase();
    const lastName = (vet.lastName ?? vet.last_name ?? "").toLocaleLowerCase();

    return (
      firstName.includes(normalizedFirstNameSearch) &&
      lastName.includes(normalizedLastNameSearch)
    );
  });
  const selectedVets = vets.filter((vet) => selectedVetIds.includes(vet.vetId));

  const handleVetSaved = async () => {
    if (!selectedVet) return;

    const refreshedVets = await reloadVets();
    setSelectedVet(
      refreshedVets.find((vet) => vet.vetId === selectedVet.vetId) ?? null,
    );
  };

  const handleDeleteVets = async () => {
    if (selectedVetIds.length === 0) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const results = await Promise.allSettled(
        selectedVetIds.map((vetId) => deleteVet(vetId)),
      );
      const failedDeletes = results.filter(
        (result) => result.status === "rejected",
      );
      const refreshedVets = await reloadVets();
      const remainingVetIds = new Set(refreshedVets.map((vet) => vet.vetId));
      setSelectedVetIds((vetIds) =>
        vetIds.filter((vetId) => remainingVetIds.has(vetId)),
      );

      if (failedDeletes.length > 0) {
        const firstFailure = failedDeletes[0];
        setDeleteError(
          firstFailure.status === "rejected"
            ? getUserFacingErrorMessage(
                firstFailure.reason,
                `No se pudieron eliminar ${failedDeletes.length} veterinarios. Inténtalo de nuevo.`,
              )
            : `No se pudieron eliminar ${failedDeletes.length} veterinarios. Inténtalo de nuevo.`,
        );
        return;
      }

      setSelectedVet(null);
      setDeleteDialogOpen(false);
    } catch (deleteError) {
      setDeleteError(
        getUserFacingErrorMessage(
          deleteError,
          "No se pudieron eliminar los veterinarios. Inténtalo de nuevo.",
        ),
      );
      try {
        const refreshedVets = await reloadVets();
        const remainingVetIds = new Set(refreshedVets.map((vet) => vet.vetId));
        setSelectedVetIds((vetIds) =>
          vetIds.filter((vetId) => remainingVetIds.has(vetId)),
        );
      } catch (refreshError) {
        console.error("No se pudo actualizar la lista de veterinarios.", refreshError);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Typography>Cargando veterinarios...</Typography>;
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              void reloadVets().catch((retryError) => {
                console.error("No se pudieron cargar los veterinarios.", retryError);
              });
            }}
          >
            Reintentar
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 3,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
          >
            Home
          </Button>
          <Typography variant="h4">Veterinarios</Typography>
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
            disabled={
              selectedVetIds.length === 0 &&
              searchFirstName === "" &&
              searchLastName === ""
            }
            onClick={() => {
              setSelectedVetIds([]);
              setSearchFirstName("");
              setSearchLastName("");
            }}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            disabled={selectedVetIds.length === 0}
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
        {vets.length} veterinarios registrados
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Buscar por nombre"
          value={searchFirstName}
          onChange={(event) => setSearchFirstName(event.target.value)}
          sx={{ width: { xs: "100%", sm: 220 } }}
        />
        <TextField
          label="Buscar por apellido"
          value={searchLastName}
          onChange={(event) => setSearchLastName(event.target.value)}
          sx={{ width: { xs: "100%", sm: 220 } }}
        />
      </Stack>

      <VetsList
        vets={filteredVets}
        onSelect={setSelectedVet}
        selectedVetIds={selectedVetIds}
        onSelectionChange={setSelectedVetIds}
      />

      <AddVetDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdded={async () => {
          await reloadVets();
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
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedVets.length === 1
              ? `¿De verdad quieres borrar a ${selectedVets[0].firstName ?? selectedVets[0].first_name} ${selectedVets[0].lastName ?? selectedVets[0].last_name}?`
              : `¿De verdad quieres borrar ${selectedVets.length} veterinarios seleccionados?`}
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            No
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDeleteVets()}
            disabled={deleting || selectedVetIds.length === 0}
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      <VetDetailModal
        open={selectedVet !== null}
        onClose={() => setSelectedVet(null)}
        onSaved={handleVetSaved}
        vet={selectedVet}
      />
    </Box>
  );
}
