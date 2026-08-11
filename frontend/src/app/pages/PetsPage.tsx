import { useState } from "react";
import type { Pet } from "../types/Pet";
import { usePets } from "../hooks/usePets";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";

import { Box, Button, Typography } from "@mui/material";

type PetsPageProps = {
  onGoHome: () => void;
};

export const PetsPage = ({ onGoHome }: PetsPageProps) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  const { pets, loading, error, loadPets } = usePets();

  const handleCloseModal = () => {
    setSelectedPet(null);
    setIsDetailOpen(false);
  };

  const handleOpenAddPetDialog = () => {
    setIsAddPetOpen(true);
  };

  const handleCloseAddPetDialog = () => {
    setIsAddPetOpen(false);
  };

  if (loading) {
    return <Typography>Cargando mascotas...</Typography>;
  }

  if (error) {
    return <Typography>Error al cargar mascotas.</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        🐾 Pets Dashboard
      </Typography>

      <Box mb={2}>
        <Button
          variant="outlined"
          onClick={onGoHome}
        >
          Home
        </Button>

        <Button
          variant="contained"
          onClick={handleOpenAddPetDialog}
          sx={{ ml: 1 }}
        >
          Add Pet
        </Button>
      </Box>

      <Typography variant="h6" mb={2}>
        Welcome back, Dr. Smith
      </Typography>

      <Typography mb={3}>
        Registered pets: {pets.length}
      </Typography>

      <PetsList
        pets={pets}
        onSelect={(pet) => {
          setSelectedPet(pet);
          setIsDetailOpen(true);
        }}
      />

      <AddPetDialog
        open={isAddPetOpen}
        onClose={handleCloseAddPetDialog}
      />

      <PetDetailModal
        pet={selectedPet}
        open={isDetailOpen}
        onClose={handleCloseModal}
        onSaved={loadPets}
      />
    </Box>
  );
};