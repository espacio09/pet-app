import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";

type Pet = {
  pet_id: number;
  pet_name: string;
  pet_type_id: number;
  sex: string;
  breed_id: number;
};

export default function PetsList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [newPet, setNewPet] = useState({
    pet_name: "",
    pet_type_id: "",
  });

  // ✅ FETCH PETS
  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3002/pets");
      if (!res.ok) throw new Error("Error al cargar mascotas");

      const data = await res.json();
      console.log("DATA:", data);

      setPets(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SOLO UNA VEZ
  useEffect(() => {
    fetchPets();
  }, []);

  // ✅ MODAL
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ✅ INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPet({
      ...newPet,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!newPet.pet_name || !newPet.pet_type_id) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:3002/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPet,
          pet_type_id: Number(newPet.pet_type_id),
        }),
      });

      if (!res.ok) throw new Error("Error al guardar mascota");

      handleClose();
      setNewPet({ pet_name: "", pet_type_id: "" });
      fetchPets();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          🐾 Lista de Mascotas
        </Typography>

        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Añadir mascota
        </Button>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {/* ✅ CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {pets.map((pet) => (
            <Card key={pet.pet_id} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{pet.pet_name}</Typography>

                <Typography color="text.secondary">
                  Tipo ID: {pet.pet_type_id}
                </Typography>

                <Typography color="text.secondary">
                  Sexo: {pet.sex}
                </Typography>

                <Typography color="text.secondary">
                  Breed ID: {pet.breed_id}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Paper>

      {/* ✅ MODAL */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Mascota</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            name="pet_name"
            fullWidth
            value={newPet.pet_name}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            label="Tipo ID"
            name="pet_type_id"
            fullWidth
            value={newPet.pet_type_id}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
