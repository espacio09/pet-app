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
import AddOwnerDialog from "../../../components/AddOwnerDialog";
import OwnerDetailModal from "../../../components/OwnerDetailModal";
import OwnersList from "../../../components/OwnersList";
import type { Owner } from "../../../types/Owner";
import { deleteOwners } from "../../../types/owners";
import { useOwners } from "../../../hooks/useOwners";

export const OwnersPage = () => {
  const { owners, loading, error, reloadOwners } = useOwners();
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [selectedDeleteOwnerIds, setSelectedDeleteOwnerIds] = useState<number[]>([]);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const selectedDeleteOwners = owners.filter((owner) =>
    selectedDeleteOwnerIds.includes(owner.ownerId),
  );
  const normalizedFirstNameSearch = searchFirstName.trim().toLocaleLowerCase();
  const normalizedLastNameSearch = searchLastName.trim().toLocaleLowerCase();
  const filteredOwners = owners.filter((owner) => {
    const firstName = (owner.firstName ?? owner.first_name ?? "").toLocaleLowerCase();
    const lastName = (owner.lastName ?? owner.last_name ?? "").toLocaleLowerCase();

    return (
      firstName.includes(normalizedFirstNameSearch) &&
      lastName.includes(normalizedLastNameSearch)
    );
  });

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
      try {
        const currentOwners = await reloadOwners();
        const currentOwnerIds = new Set(
          currentOwners.map((owner) => owner.ownerId),
        );
        setSelectedDeleteOwnerIds((ownerIds) =>
          ownerIds.filter((ownerId) => currentOwnerIds.has(ownerId)),
        );
      } catch (refreshError) {
        console.error("No se pudo actualizar la lista de propietarios.", refreshError);
      }
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
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
          >
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
            disabled={
              selectedDeleteOwnerIds.length === 0 &&
              searchFirstName === "" &&
              searchLastName === ""
            }
            onClick={() => {
              setSelectedDeleteOwnerIds([]);
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

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
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

      <OwnersList
        owners={filteredOwners}
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
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿De verdad quieres borrar estos usuarios?
            {" "}
            {selectedDeleteOwners.length === 1
              ? `${selectedDeleteOwners[0].firstName ?? selectedDeleteOwners[0].first_name} ${selectedDeleteOwners[0].lastName ?? selectedDeleteOwners[0].last_name}`
              : `${selectedDeleteOwners.length} propietarios seleccionados`}
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
