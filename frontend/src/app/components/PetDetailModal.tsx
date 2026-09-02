import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { Pet } from "../types/Pet";
import { germanDateFormatter } from "../shared/formatters";
import { useEffect, useState } from "react";
import { updatePet } from "../types/pets";
import Stack from "@mui/material/Stack";


//    muestra detalles de una mascota

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
  const [weight, setWeight] = useState<number>(0);
  const [birthdate, setBirthdate] = useState("");
  const [microchip_no, setMicrochip] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!pet) return;

    setName(pet.petName ?? "");
    setColor(pet.color ?? "");
    setSex(pet.sex ?? "");
    setWeight(pet.weight ?? 0);
    setMicrochip(pet.microchip_no ?? 0);
    setBirthdate(
      pet.birthdate instanceof Date
        ? pet.birthdate.toISOString().slice(0, 10)
        : new Date(pet.birthdate).toISOString().slice(0, 10)
    );
    setIsEditing(false);
  }, [pet]);

  if (!pet) return null;

  const ownerName = [pet.ownerFirstName, pet.ownerLastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const handleSave = async () => {
    try {
      await updatePet(pet.petId, {
        color,
        pet_name: name,
        sex,
        birthdate: birthdate ? new Date(birthdate) : undefined,
        microchip_no,
        weight: Number(weight),
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
        <DialogTitle>{pet.petName}</DialogTitle>
      <Typography>
    Editing: {isEditing ? "YES" : "NO"}
  </Typography>


  <DialogContent>
        <Stack spacing={2}>

  <Typography>
    <strong>ID:</strong> {pet.petId}
  </Typography>


{isEditing ? (
  <TextField
    label="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    fullWidth
  />
) : (
  <Typography>
    <strong>Name:</strong> {pet.petName}
  </Typography>
)}


{isEditing ? (
  <TextField
    label="Color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    fullWidth
  />
) : (
  <Typography>
    <strong>Color:</strong> {pet.color}
  </Typography>
)}

{isEditing ? (
  <TextField
    label="Sex"
    value={sex}
    onChange={(e) => setSex(e.target.value)}
    fullWidth
  />
) : (
  <Typography>
    <strong>Sex:</strong> {pet.sex}
  </Typography>
)}

{isEditing ? (
  <TextField
  label="Birthdate"
  type="date"
  value={birthdate}
  onChange={(e) => setBirthdate(e.target.value)}
  fullWidth
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}

  />
) : (
  <Typography>
    <strong>Birthdate:</strong>{" "}
    {germanDateFormatter(pet.birthdate)}
  </Typography>
)}


{isEditing ? (
  <TextField
    label="Weight"
    type="number"
    onChange={(e) => setWeight(Number(e.target.value))}
    fullWidth
  />
) : (
  <Typography>
    <strong>Weight:</strong> {pet.weight}
  </Typography>
)}


  <Typography>
    <strong>Age:</strong> {pet.age}
  </Typography>


{isEditing ? (
 <TextField
  label="Microchip No"
  type="number"
  value={microchip_no}
  onChange={(e) =>
    setMicrochip(Number(e.target.value))
  }
  fullWidth
/>
) : (
  <Typography>
    <strong>Microchip No:</strong> {pet.microchip_no}
  </Typography>
)}


  <Typography>
    <strong>Breed ID:</strong> {pet.breed_id}
  </Typography>

  <Typography>
    <strong>Owner:</strong> {ownerName || "Sin propietario"}
  </Typography>

  <Typography>
    <strong>Owner ID:</strong> {pet.ownerId}
  </Typography>

        <DialogActions>
    <Button onClick={onClose}>
    Close
  </Button>

  {!isEditing ? (
    <Button onClick={() => setIsEditing(true)}>
      Edit
    </Button>
  ) : (
    <Button onClick={handleSave}>
      Save
    </Button>
  )}
  </DialogActions>
      </Stack>

          </DialogContent>
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