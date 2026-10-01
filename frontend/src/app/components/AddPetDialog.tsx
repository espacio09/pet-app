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
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import {
  checkMicrochipAvailability,
  createPet,
  getBreedId,
} from "../types/pets";

const duplicateMicrochipMessage =
  "¡El número de microchip ya existe! Verifique su entrada.";

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
  const [notes, setNotes] = useState("");
  const [breedName, setBreedName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [breedId, setBreedId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [microchipError, setMicrochipError] = useState("");

  useEffect(() => {
    const normalizedBreedName = breedName.trim();

    if (!normalizedBreedName) {
      setBreedId("");
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      void getBreedId(normalizedBreedName)
        .then((id) => {
          if (!cancelled) setBreedId(id === null ? "" : String(id));
        })
        .catch(() => {
          if (!cancelled) setBreedId("");
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [breedName]);

  const handleMicrochipBlur = async () => {
    const microchipValue = Number(microchipNo);
    if (!microchipNo || !Number.isInteger(microchipValue) || microchipValue <= 0) {
      setMicrochipError("");
      return;
    }

    try {
      const available = await checkMicrochipAvailability(microchipValue);
      setMicrochipError(available ? "" : duplicateMicrochipMessage);
    } catch {
      setMicrochipError("");
    }
  };

  const handleSave = async () => {
    const weightValue = Number(weight);
    const birthdateValue = new Date(birthdate);

    if (
      !name.trim() ||
      !sex.trim() ||
      !color.trim() ||
      !birthdate ||
      !breedName.trim() ||
      !ownerName.trim()||
      microchipNo.trim() === ""
    ) {
      setErrorMessage("Name, sex, color, birthdate, breed name, microchip number, and owner name are required.");
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

    if (microchipError) {
      setErrorMessage(microchipError);
      return;
    }

    try {
      setErrorMessage("");
      const createdPet = await createPet({
        pet_name: name.trim(),
        owner_name: ownerName.trim(),
        color: color.trim(),
        sex: sex.trim(),
        birthdate: birthdateValue,
        microchip_no: microchipNo ? Number(microchipNo) : undefined,
        weight: weightValue,
        pet_typeId: 1,
        breed_name: breedName.trim(),
        notes: notes.trim(),
      });

      setOwnerId(String(createdPet.ownerId ?? createdPet.owner_id ?? ""));
      setBreedId(String(createdPet.breed_id ?? ""));
      await onPetAdded();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create pet.";
      setErrorMessage(message);
      if (message === duplicateMicrochipMessage) setMicrochipError(message);
    }
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
            minHeight: { xs: "auto", sm: "min(720px, 90vh)" },
            maxHeight: "90vh",
          },
        },
      }}
    >
      {/* ── HEADER ── */}
      <DialogTitle
        sx={{
          px: 4,
          py: 2,
          fontWeight: 700,
          fontSize: "1.25rem",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        Add Pet
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ── CONTENIDO CON SCROLL ── */}
      <DialogContent
        sx={{
          px: 4,
          py: 2,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
            mt: 1,
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

          <TextField
            label="Microchip No"
            value={microchipNo}
            onChange={(e) => {
              setMicrochipNo(e.target.value);
              setMicrochipError("");
            }}
            onBlur={() => void handleMicrochipBlur()}
            error={Boolean(microchipError)}
            helperText={microchipError || " "}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            fullWidth
          />

          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 2,
            }}
          >
            <TextField
              label="Breed name"
              value={breedName}
              onChange={(e) => setBreedName(e.target.value)}
              fullWidth
            />

            <Box>
              <Typography variant="caption" color="text.secondary">
                Breed ID
              </Typography>
              <Typography variant="body1">
                {breedId || (breedName.trim() ? "Assigned on save" : "-")}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 2,
            }}
          >
            <TextField
              label="Owner name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              fullWidth
            />

            {ownerId && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Owner ID
                </Typography>
                <Typography variant="body1">{ownerId}</Typography>
              </Box>
            )}
          </Box>

          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ gridColumn: "1 / -1" }}
          />

        </Box>
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
      </DialogContent>

      {/* ── FOOTER FIJO ── */}
      <DialogActions
        sx={{
          px: 4,
          py: 2,
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
          Close
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