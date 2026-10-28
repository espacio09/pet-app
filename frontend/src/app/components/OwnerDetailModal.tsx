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
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (!owner) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setIsEditing(false);
      setValidationMessage("");
      setSaveErrorMessage("");
      return;
    }

    setFirstName(owner.firstName ?? owner.first_name ?? "");
    setLastName(owner.lastName ?? owner.last_name ?? "");
    setEmail(owner.email ?? "");
    setPhone(owner.phone ?? "");
    setAddress(owner.address ?? "");
    setIsEditing(false);
    setValidationMessage("");
    setSaveErrorMessage("");
  }, [open, owner]);

  if (!owner) return null;

  const handleSave = async () => {
    if (isSaving) return;

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
    setSaveErrorMessage("");
    setIsSaving(true);

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
      setSnackbarMessage("Propietario actualizado correctamente");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el propietario",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setIsEditing(false);
    setFirstName(owner.firstName ?? owner.first_name ?? "");
    setLastName(owner.lastName ?? owner.last_name ?? "");
    setEmail(owner.email ?? "");
    setPhone(owner.phone ?? "");
    setAddress(owner.address ?? "");
    setValidationMessage("");
    setSaveErrorMessage("");
    onClose();
  };

  const ownerName = `${firstName} ${lastName}`.trim() || "Propietario";

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {ownerName}
          <IconButton
            aria-label="Cerrar"
            onClick={handleClose}
            disabled={isSaving}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            pt: 3,
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000",
            },
            "& .MuiInputLabel-root.Mui-disabled": {
              color: "#000",
            },
          }}
        >
          {validationMessage && (
            <Alert severity="error">{validationMessage}</Alert>
          )}
          {saveErrorMessage && (
            <Alert severity="error">{saveErrorMessage}</Alert>
          )}
          <TextField
            label="Nombre"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
              setValidationMessage("");
              setSaveErrorMessage("");
            }}
            disabled={!isEditing}
            required
            fullWidth
            sx={{ mt: 1 }}
          />
          <TextField
            label="Apellido"
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
              setValidationMessage("");
              setSaveErrorMessage("");
            }}
            disabled={!isEditing}
            required
            fullWidth
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSaveErrorMessage("");
            }}
            disabled={!isEditing}
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setValidationMessage("");
              setSaveErrorMessage("");
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
              setSaveErrorMessage("");
            }}
            disabled={!isEditing}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSaving}>Cerrar</Button>
          {isEditing ? (
            <Button
              onClick={() => void handleSave()}
              disabled={isSaving}
              variant="contained"
            >
              Guardar
            </Button>
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
          severity="success"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
