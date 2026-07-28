import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { Pet } from "../models/Pet";
import { germanDateFormatter } from "../../../shared/formatters";
import { useState } from "react";
import { updatePet } from "../models/pets";



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
    const [color, setColor] = useState(pet?.color ?? "");

  if (!pet) return null;


const handleSave = async () => {
  try {
    
  await updatePet(
  pet.petId,
  {
    color,
  }
);

await onSaved();

setIsEditing(false);


    await onSaved();

    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{pet.petName}</DialogTitle>
    <Typography>
  Editing: {isEditing ? "YES" : "NO"}
</Typography>
<DialogContent>
  <Typography>
    <strong>ID:</strong> {pet.petId}
  </Typography>

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


  <Typography>
    <strong>Sex:</strong> {pet.sex}
  </Typography>

  <Typography>
    <strong>Birth Date:</strong> {germanDateFormatter(pet.birthdate)}
  </Typography>

  <Typography>
    <strong>Age:</strong> {pet.age}
  </Typography>

  <Typography>
    <strong>Weight:</strong> {pet.weight}
  </Typography>

  <Typography>
    <strong>Breed ID:</strong> {pet.breed_id}
  </Typography>

  <Typography>
    <strong>Owner ID:</strong> {pet.ownerId}
  </Typography>
</DialogContent>


<DialogContent>

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
    
        </DialogContent>
    </Dialog>
  );
}