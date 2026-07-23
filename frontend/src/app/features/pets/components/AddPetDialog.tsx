import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

interface AddPetDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddPetDialog({
  open,
  onClose,
}: AddPetDialogProps) {
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
            fullWidth
          />

          <TextField
            label="Sex"
            fullWidth
          />

          <TextField
            label="Weight"
            type="number"
            fullWidth
          />

         <TextField
  label="Birthdate"
  type="date"
  fullWidth
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
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