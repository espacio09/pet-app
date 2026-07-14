import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Pet } from "./types/Pet";

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
      <DialogTitle>{pet.name}</DialogTitle>

      <DialogContent>
        <Typography>
          <strong>Species:</strong> {pet.species}
        </Typography>

        <Typography>
          <strong>Breed:</strong> {pet.breed}
        </Typography>

        <Typography>
          <strong>Age:</strong> {pet.age}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}