import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface AddPetDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddPetDialog({
  open,
  onClose,
}: AddPetDialogProps) {

  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [microchipNo, setMicrochipNo] = useState("");
  const [color, setColor] = useState("");
  const [ownerId, setOwnerId] = useState("");



console.log({
  name,
  sex,
  weight,
  birthdate,
  microchipNo,
  color,
  ownerId
});


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Pet</DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            mt: 1,
            minWidth: 400,
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Microchip No"
            value={microchipNo}
            onChange={(e) => setMicrochipNo(e.target.value)}
            fullWidth
          />

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
            
          <TextField
            label="Sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            fullWidth
          />  
          <TextField
            label="Weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            fullWidth
          />
          
          <TextField
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            fullWidth
          />
        
   <TextField
            label="Owner ID"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            fullWidth
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}