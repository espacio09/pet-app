import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Pet } from "../models/Pet";


//    muestra detalles de una mascota

interface PetDetailModalProps {
  open: boolean;
  onClose: () => void;
  pet: Pet | null;
}

export default function PetDetailModal({
  open,
  onClose,
  pet,

  
}: PetDetailModalProps) {
  if (!pet) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{pet.petName}</DialogTitle>
<DialogTitle>{pet.petName}</DialogTitle>

<DialogContent>
  <Typography>
    <strong>ID:</strong> {pet.petId}
  </Typography>

  <Typography>
    <strong>Color:</strong> {pet.color}
  </Typography>

  <Typography>
    <strong>Sex:</strong> {pet.sex}
  </Typography>

  <Typography>
    <strong>Birth Date:</strong> {pet.birthdate}
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
    <strong>Owner ID:</strong> {pet.owner_id}
  </Typography>
</DialogContent>

<Typography>
  <strong>Species:</strong> {pet.petId}
</Typography>

<DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    
        </DialogContent>
    </Dialog>
  );
}