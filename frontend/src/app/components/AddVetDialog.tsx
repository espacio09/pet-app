import { useEffect, useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { createOwner, DuplicateOwnerNameError } from "../types/owners";

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
  const [duplicateNameWarning, setDuplicateNameWarning] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFirstName("");
    setLastName("");
    setAddress("");
    setEmail("");
    setPhone("");
    setErrorMessage("");
    setDuplicateNameWarning("");
  }, [open]);

  const handleSave = async (confirmDuplicateName = false) => {
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
        confirm_duplicate_name: confirmDuplicateName || undefined,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        address: trimmedAddress,
        email: email.trim() || undefined,
        phone: trimmedPhone,
      });
      await onAdded();
      onClose();
    } catch (error) {
      if (error instanceof DuplicateOwnerNameError) {
        setDuplicateNameWarning(error.message);
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "No se pudo crear el propietario.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (setValue: (value: string) => void) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setValue(event.target.value);
    setDuplicateNameWarning("");
    setErrorMessage("");
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar propietario</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {duplicateNameWarning && (
          <Alert severity="warning">{duplicateNameWarning}</Alert>
        )}
        <TextField
          label="Nombre"
          value={firstName}
          onChange={handleFieldChange(setFirstName)}
          required
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Apellido"
          value={lastName}
          onChange={handleFieldChange(setLastName)}
          required
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Dirección"
          value={address}
          onChange={handleFieldChange(setAddress)}
          required
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={handleFieldChange(setEmail)}
          disabled={saving}
          fullWidth
        />
        <TextField
          label="Teléfono"
          type="tel"
          value={phone}
          onChange={handleFieldChange(setPhone)}
          slotProps={{ htmlInput: { inputMode: "numeric" } }}
          required
          disabled={saving}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>No</Button>
        {duplicateNameWarning && (
          <Button
            onClick={() => setDuplicateNameWarning("")}
            disabled={saving}
          >
            Revisar datos
          </Button>
        )}
        <Button
          onClick={() => void handleSave(Boolean(duplicateNameWarning))}
          disabled={saving}
          variant="contained"
        >
          {duplicateNameWarning ? "Confirmar y guardar" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}