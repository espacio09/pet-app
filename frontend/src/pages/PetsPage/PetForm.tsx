import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

interface Pet {
  pet_id: number;
  pet_type_id: number;
  pet_name: string;
  weight: number;
  color: string;
}

interface EditPetProps {
  pet: Pet;
  onClose: () => void;
}

export default function EditPet({ pet, onClose }: EditPetProps) {
  const [weight, setWeight] = useState<string>(String(pet.weight));
  const [color, setColor] = useState<string>(pet.color);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setError("");


    try {
      const res = await fetch(
        `http://localhost:3002/pets/${pet.pet_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weight: Number(weight),
            color,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message);
      }

      onClose();
      alert("Updated ✅");
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Edit {pet.pet_name}</Typography>

      <TextField
        label="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error}
      />

      <TextField
        label="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        fullWidth
        margin="normal"
      />

      
<Button
  variant="contained"
  onClick={handleUpdate}
>
  Save
</Button>

    </Box>
  );
}
