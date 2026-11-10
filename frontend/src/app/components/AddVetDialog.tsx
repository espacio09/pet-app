import { useEffect, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { createVet } from "../types/vets";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

type AddVetDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdded: () => Promise<void>;
};

export default function AddVetDialog({
  open,
  onClose,
  onAdded,
}: AddVetDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setFirstName("");
    setLastName("");
    setStreet("");
    setHouseNumber("");
    setPostalCode("");
    setCity("");
    setEmail("");
    setPhone("");
    setErrorMessage("");
  }, [open]);

  const handleSave = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedStreet = street.trim();
    const trimmedHouseNumber = houseNumber.trim();
    const trimmedPostalCode = postalCode.trim();
    const trimmedCity = city.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPhone) {
      setErrorMessage(
        "Nombre, apellido, correo electrónico y teléfono son obligatorios.",
      );
      return;
    }

    if (!/^\d+$/.test(trimmedPhone)) {
      setErrorMessage("Número no válido.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      await createVet({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        street: trimmedStreet || undefined,
        houseNumber: trimmedHouseNumber || undefined,
        postalCode: trimmedPostalCode || undefined,
        city: trimmedCity || undefined,
        email: trimmedEmail,
        phone: trimmedPhone,
      });
      await onAdded();
      onClose();
    } catch (error) {
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "No se pudo crear el veterinario. Inténtalo de nuevo.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (setValue: (value: string) => void) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setValue(event.target.value);
    setErrorMessage("");
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar veterinario</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
          }}
        >
          <TextField
            label="Calle"
            value={street}
            onChange={handleFieldChange(setStreet)}
            disabled={saving}
            fullWidth
          />
          <TextField
            label="Número"
            value={houseNumber}
            onChange={handleFieldChange(setHouseNumber)}
            disabled={saving}
            fullWidth
          />
          <TextField
            label="Código postal"
            value={postalCode}
            onChange={handleFieldChange(setPostalCode)}
            disabled={saving}
            fullWidth
          />
          <TextField
            label="Ciudad"
            value={city}
            onChange={handleFieldChange(setCity)}
            disabled={saving}
            fullWidth
          />
        </Box>
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
        <TextField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={handleFieldChange(setEmail)}
          required
          disabled={saving}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>No</Button>
        <Button
          onClick={() => void handleSave()}
          disabled={saving}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}