import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import type { Pet } from "../types/Pet";
import { germanDateFormatter } from "../shared/formatters";
import { useEffect, useState } from "react";
import { updatePet } from "../types/pets";

function toDateInputValue(value: Date | string | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

interface PetDetailModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  pet: Pet | null;
}

export default function PetDetailModal({
  open,
  onClose,
  onSaved,
  pet,
}: PetDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [microchipNo, setMicrochipNo] = useState("");
  const [ownerNameInput, setOwnerNameInput] = useState("");
  const [breedNameInput, setBreedNameInput] = useState("");
  const [savedPet, setSavedPet] = useState<Pet | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!pet) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;

      setName(pet.petName ?? "");
      setColor(pet.color ?? "");
      setSex(pet.sex ?? "");
      setWeight(String(pet.weight ?? ""));
      setMicrochipNo(String(pet.microchip_no ?? ""));
      setOwnerNameInput(
        pet.ownerName ||
          [pet.ownerFirstName, pet.ownerLastName]
            .filter(Boolean)
            .join(" ")
            .trim(),
      );
      setBreedNameInput(pet.breedName || pet.breed_name || "");
      setBirthdate(toDateInputValue(pet.birthdate));
      setSavedPet(null);
      setIsEditing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [pet]);

  if (!pet) return null;

  const displayedPet = savedPet ?? pet;

  const ownerName =
    displayedPet.ownerName ||
    [displayedPet.ownerFirstName, displayedPet.ownerLastName]
      .filter(Boolean)
      .join(" ")
      .trim();
  const breedName = displayedPet.breedName || displayedPet.breed_name;

  const handleSave = async () => {
    const weightValue = Number(weight);
    const birthdateValue = birthdate ? new Date(birthdate) : undefined;

    const requiredFields: Array<[string, string]> = [
      ["Name", name],
      ["Color", color],
      ["Sex", sex],
      ["Birthdate", birthdate],
      ["Weight", weight],
      ["Microchip No", microchipNo],
      ["Owner name", ownerNameInput],
      ["Breed name", breedNameInput],
    ];
    const missingField = requiredFields.find(([, value]) => !value.trim());

    if (missingField) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`${missingField[0]} is required`);
      setSnackbarOpen(true);
      return;
    }

    if (!Number.isFinite(weightValue) || weightValue < 0) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Weight must be a valid non-negative number");
      setSnackbarOpen(true);
      return;
    }

    if (microchipNo) {
      const microchipValue = Number(microchipNo);
      if (!Number.isInteger(microchipValue) || microchipValue <= 0) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Microchip number must be a positive integer");
        setSnackbarOpen(true);
        return;
      }
    }

    if (birthdate && Number.isNaN(birthdateValue?.getTime())) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Birthdate must be a valid date");
      setSnackbarOpen(true);
      return;
    }

    try {
      const updatedPet = await updatePet(pet.petId, {
        color: color.trim(),
        pet_name: name.trim(),
        sex: sex.trim(),
        birthdate: birthdateValue,
        owner_name: ownerNameInput.trim(),
        breed_name: breedNameInput.trim(),
        microchip_no: microchipNo ? Number(microchipNo) : undefined,
        weight: weightValue,
      });

      setSavedPet({
        ...displayedPet,
        petName: name.trim(),
        color: color.trim(),
        sex,
        birthdate: birthdateValue ?? displayedPet.birthdate,
        ownerId: updatedPet.ownerId ?? displayedPet.ownerId,
        ownerName: ownerNameInput.trim(),
        breed_id: updatedPet.breed_id ?? displayedPet.breed_id,
        breedName: breedNameInput.trim(),
        microchip_no: microchipNo
          ? Number(microchipNo)
          : displayedPet.microchip_no,
        weight: weightValue,
      });
      await onSaved();
      setSnackbarSeverity("success");
      setSnackbarMessage("Mascota actualizada correctamente");
      setSnackbarOpen(true);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage("No se pudo guardar la mascota");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
          <DialogTitle>
        {displayedPet.petName}
  <IconButton
    aria-label="close"
    onClick={onClose}
    sx={{
      position: "absolute",
      right: 8,
      top: 8,
      color: (theme) => theme.palette.grey[500],
    }}
  >
    <CloseIcon />
  </IconButton>

        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {/* Row 1 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>ID:</strong> {displayedPet.petId}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Name:</strong> {displayedPet.petName}
                </Typography>
              )}
            </Grid>

            {/* Row 2 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Color:</strong> {displayedPet.color}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Sex:</strong> {displayedPet.sex}
                </Typography>
              )}
            </Grid>

            {/* Row 3 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  fullWidth
                  size="small"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              ) : (
                <Typography>
                  <strong>Birthdate:</strong>{" "}
                  {germanDateFormatter(displayedPet.birthdate)}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  slotProps={{ htmlInput: { min: 0, step: "any" } }}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Weight:</strong> {displayedPet.weight}
                </Typography>
              )}
            </Grid>

            {/* Row 4 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Age:</strong> {displayedPet.age}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Microchip No"
                  type="number"
                  value={microchipNo}
                  onChange={(e) => setMicrochipNo(e.target.value)}
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Microchip No:</strong> {displayedPet.microchip_no}
                </Typography>
              )}
            </Grid>

            {/* Row 5 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Owner name"
                  value={ownerNameInput}
                  onChange={(e) => setOwnerNameInput(e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Owner:</strong> {ownerName || "Sin propietario"}
                </Typography>
              )}
            </Grid> 

            {/* Row 6 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Breed ID:</strong> {displayedPet.breed_id ?? "Sin raza"}
              </Typography>
            </Grid>

            {/* Row 7 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {isEditing ? (
                <TextField
                  label="Breed name"
                  value={breedNameInput}
                  onChange={(e) => setBreedNameInput(e.target.value)}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>
                  <strong>Breed:</strong> {breedName || "Sin raza"}
                </Typography>
              )}
            </Grid>
           
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <Button onClick={handleSave}>Save</Button>
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
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}