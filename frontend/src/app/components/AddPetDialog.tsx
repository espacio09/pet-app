// src/components/AddPetDialog.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { createPet } from "../types/pets";

interface AddPetDialogProps {
  open: boolean;
  onClose: () => void;
  onPetAdded: () => Promise<void>;
}

export default function AddPetDialog({
  open,
  onClose,
  onPetAdded,
}: AddPetDialogProps) {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [microchipNo, setMicrochipNo] = useState("");
  const [color, setColor] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    const ownerIdValue = Number(ownerId);
    const weightValue = Number(weight);
    const birthdateValue = new Date(birthdate);

    if (!name.trim() || !sex.trim() || !color.trim() || !birthdate) {
      setErrorMessage("Name, sex, color and birthdate are required.");
      return;
    }

    if (!Number.isInteger(ownerIdValue) || ownerIdValue <= 0) {
      setErrorMessage("Owner ID must be a positive integer.");
      return;
    }

    if (!Number.isFinite(weightValue) || weightValue < 0) {
      setErrorMessage("Weight must be a valid non-negative number.");
      return;
    }

    if (microchipNo) {
      const microchipValue = Number(microchipNo);
      if (!Number.isInteger(microchipValue) || microchipValue <= 0) {
        setErrorMessage("Microchip number must be a positive integer.");
        return;
      }
    }

    if (Number.isNaN(birthdateValue.getTime())) {
      setErrorMessage("Birthdate must be a valid date.");
      return;
    }

    setErrorMessage("");
    await createPet({
      pet_name: name.trim(),
      ownerId: ownerIdValue,
      color: color.trim(),
      sex: sex.trim(),
      birthdate: birthdateValue,
      microchip_no: microchipNo ? Number(microchipNo) : undefined,
      weight: weightValue,
      pet_typeId: 1,
      breed_id: 1,
    });

    await onPetAdded();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
          },
        },
      }}
    >
      {/* ── HEADER ── */}
      <DialogTitle
        sx={{
          px: 4,
          py: 2.5,
          fontWeight: 700,
          fontSize: "1.25rem",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        Add Pet
      </DialogTitle>

      {/* ── CONTENIDO CON SCROLL ── */}
      <DialogContent
        sx={{
          px: 4,
          py: 3,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 3,
            mt: 0.5,
          }}
        >
          {/* Columna 1 */}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          {/* Columna 2 */}
          <TextField
            label="Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            fullWidth
          />

          {/* Columna 1 */}
          <TextField
            label="Birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {/* Columna 2 */}
          <TextField
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            slotProps={{ htmlInput: { min: 0, step: "any" } }}
            fullWidth
          />

          {/* Columna 1 */}
          <TextField
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            fullWidth
          />

          {/* Columna 2 */}
          <TextField
            label="Owner ID"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            fullWidth
          />

          {/* Full width: ocupa las 2 columnas */}
          <TextField
            label="Microchip No"
            value={microchipNo}
            onChange={(e) => setMicrochipNo(e.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          />
        </Box>
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
      </DialogContent>

      {/* ── FOOTER FIJO ── */}
      <DialogActions
        sx={{
          px: 4,
          py: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}