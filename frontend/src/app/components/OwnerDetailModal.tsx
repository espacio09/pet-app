import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import type { Owner } from "../types/Owner";
import { updateOwner } from "../types/owners";

interface OwnerDetailModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  owner: Owner | null;
}

export default function OwnerDetailModal({
  open,
  onClose,
  onSaved,
  owner,
}: OwnerDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (!owner) return;

    setFirstName(owner.firstName ?? owner.first_name ?? "");
    setLastName(owner.lastName ?? owner.last_name ?? "");
    setEmail(owner.email ?? "");
    setPhone(owner.phone ?? "");
    setAddress(owner.address ?? "");
    setIsEditing(false);
    setValidationMessage("");
  }, [owner]);

  if (!owner) return null;

  const handleSave = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedAddress || !trimmedPhone) {
      setValidationMessage("Nombre, apellido, dirección y teléfono son obligatorios.");
      return;
    }

    if (!/^\d+$/.test(trimmedPhone)) {
      setValidationMessage("Número no válido.");
      return;
    }

    setValidationMessage("");

    try {
      await updateOwner(owner.ownerId, {
        ownerId: owner.ownerId,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        email: email.trim(),
        phone: trimmedPhone,
        address: trimmedAddress,
      });
      await onSaved();
      setIsEditing(false);
      setIsError(false);
      setSnackbarMessage("Propietario actualizado correctamente");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setSnackbarMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el propietario",
      );
    }
    setSnackbarOpen(true);
  };

  const ownerName = `${firstName} ${lastName}`.trim() || "Propietario";

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {ownerName}
          <IconButton
            aria-label="Cerrar"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          {validationMessage && (
            <Alert severity="error">{validationMessage}</Alert>
          )}
          <TextField
            label="Nombre"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
              setValidationMessage("");
            }}
            disabled={!isEditing}
            required
            fullWidth
          />
          <TextField
            label="Apellido"
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
              setValidationMessage("");
            }}
            disabled={!isEditing}
            required
            fullWidth
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={!isEditing}
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setValidationMessage("");
            }}
            disabled={!isEditing}
            required
            slotProps={{ htmlInput: { inputMode: "numeric" } }}
            fullWidth
          />
          <TextField
            label="Dirección"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setValidationMessage("");
            }}
            disabled={!isEditing}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
          {isEditing ? (
            <Button onClick={() => void handleSave()}>Guardar</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar</Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={isError ? "error" : "success"}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
