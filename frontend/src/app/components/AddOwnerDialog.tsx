import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { createOwner } from "../types/owners";

type AddOwnerDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdded: () => Promise<void>;
};

export default function AddOwnerDialog({
  open,
  onClose,
  onAdded,
}: AddOwnerDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFirstName("");
    setLastName("");
    setAddress("");
    setEmail("");
    setPhone("");
    setErrorMessage("");
  }, [open]);

  const handleSave = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedAddress || !trimmedPhone) {
      setErrorMessage("Nombre, apellido, dirección y teléfono son obligatorios.");
      return;
    }

    if (!/^\d+$/.test(trimmedPhone)) {
      setErrorMessage("Número no válido.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      await createOwner({
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        address: trimmedAddress,
        email: email.trim() || undefined,
        phone: trimmedPhone,
      });
      await onAdded();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo crear el propietario.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar propietario</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField
          label="Nombre"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Apellido"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Dirección"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          required
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Teléfono"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          slotProps={{ htmlInput: { inputMode: "numeric" } }}
          required
          disabled={saving}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>No</Button>
        <Button onClick={() => void handleSave()} disabled={saving} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}