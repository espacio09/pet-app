import { useEffect, useState, type HTMLAttributes } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import type { Vet } from "../types/Vet";
import { updateVet } from "../types/vets";
import { getUserFacingErrorMessage } from "../shared/utils/user-facing-error";

interface VetFieldProps {
  id: string;
  label: string;
  value: string | number;
  disabled: boolean;
  required?: boolean;
  fullWidthRow?: boolean;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange?: (value: string) => void;
}

function VetField({
  id,
  label,
  value,
  disabled,
  required = false,
  fullWidthRow = false,
  type = "text",
  inputMode,
  onChange,
}: VetFieldProps) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: fullWidthRow ? "1 / -1" : undefined }}>
      <Typography
        component="label"
        htmlFor={id}
        variant="body2"
        sx={{ display: "block", mb: 0.5, fontWeight: 400 }}
      >
        {label}
        {required && " *"}
      </Typography>
      <TextField
        id={id}
        value={value}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
        disabled={disabled}
        required={required}
        type={type}
        fullWidth
        slotProps={inputMode ? { htmlInput: { inputMode } } : undefined}
      />
    </Box>
  );
}

interface VetDetailModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  vet: Vet | null;
}

export default function VetDetailModal({
  open,
  onClose,
  onSaved,
  vet,
}: VetDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (!vet) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setStreet("");
      setHouseNumber("");
      setPostalCode("");
      setCity("");
      setIsEditing(false);
      setValidationMessage("");
      setSaveErrorMessage("");
      return;
    }

    setFirstName(vet.firstName ?? vet.first_name ?? "");
    setLastName(vet.lastName ?? vet.last_name ?? "");
    setEmail(vet.email ?? "");
    setPhone(vet.phone ?? vet.phoneNumber ?? "");
    setStreet(vet.street ?? "");
    setHouseNumber(vet.houseNumber ?? "");
    setPostalCode(vet.postalCode ?? "");
    setCity(vet.city ?? "");
    setIsEditing(false);
    setValidationMessage("");
    setSaveErrorMessage("");
  }, [open, vet]);

  if (!vet) return null;

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedStreet = street.trim();
    const trimmedHouseNumber = houseNumber.trim();
    const trimmedPostalCode = postalCode.trim();
    const trimmedCity = city.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPhone) {
      setValidationMessage("Nombre, apellido, correo electrónico y teléfono son obligatorios.");
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
      await updateVet(vet.vetId, {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phone: trimmedPhone,
        street: trimmedStreet,
        houseNumber: trimmedHouseNumber,
        postalCode: trimmedPostalCode,
        city: trimmedCity,
      });
      await onSaved();
      setIsEditing(false);
      setSnackbarMessage("Veterinario actualizado correctamente");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSaveErrorMessage(
        getUserFacingErrorMessage(
          error,
          "No se pudo guardar el veterinario. Inténtalo de nuevo.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    setIsEditing(false);
    setFirstName(vet.firstName ?? vet.first_name ?? "");
    setLastName(vet.lastName ?? vet.last_name ?? "");
    setEmail(vet.email ?? "");
    setPhone(vet.phone ?? vet.phoneNumber ?? "");
    setStreet(vet.street ?? "");
    setHouseNumber(vet.houseNumber ?? "");
    setPostalCode(vet.postalCode ?? "");
    setCity(vet.city ?? "");
    setValidationMessage("");
    setSaveErrorMessage("");
    onClose();
  };

  const vetName = `${firstName} ${lastName}`.trim() || "Veterinario";

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          {vetName}
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
            gap: 1.5,
            pt: 2,
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
          <Box
            role="group"
            aria-label="Datos del veterinario"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            <VetField
              id="vet-id"
              label="ID"
              value={vet.vetId}
              disabled
              fullWidthRow
            />
            <VetField
              id="vet-first-name"
              label="Nombre"
              value={firstName}
              onChange={(value) => {
                setFirstName(value);
                setValidationMessage("");
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
              required
            />
            <VetField
              id="vet-last-name"
              label="Apellido"
              value={lastName}
              onChange={(value) => {
                setLastName(value);
                setValidationMessage("");
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
              required
            />
            <VetField
              id="vet-street"
              label="Calle"
              value={street}
              onChange={(value) => {
                setStreet(value);
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
            />
            <VetField
              id="vet-house-number"
              label="Número"
              value={houseNumber}
              onChange={(value) => {
                setHouseNumber(value);
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
            />
            <VetField
              id="vet-postal-code"
              label="Código postal"
              value={postalCode}
              onChange={(value) => {
                setPostalCode(value);
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
            />
            <VetField
              id="vet-city"
              label="Ciudad"
              value={city}
              onChange={(value) => {
                setCity(value);
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
            />
            <VetField
              id="vet-phone"
              label="Teléfono"
              value={phone}
              onChange={(value) => {
                setPhone(value);
                setValidationMessage("");
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
              required
              inputMode="numeric"
            />
            <VetField
              id="vet-email"
              label="Correo electrónico"
              value={email}
              onChange={(value) => {
                setEmail(value);
                setSaveErrorMessage("");
              }}
              disabled={!isEditing}
              required
              type="email"
            />
          </Box>
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
