import { useState } from "react";
import type { Pet } from "../types/Pet";
import { usePets } from "../hooks/usePets";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";

import {
  Box,
  Button,
  Typography,
  TextField,
} from "@mui/material";

type PetsPageProps = {
  onGoHome: () => void;
};

export const PetsPage = ({ onGoHome }: PetsPageProps) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
const [birthSearch, setBirthSearch] = useState("");

  const { pets, loading, error, loadPets } = usePets();

  const filteredPets = pets.filter((pet) => {
  const matchesName =
    pet.petName
      .toLowerCase()
      .includes(nameSearch.toLowerCase());

  const matchesBirth =
    birthSearch === "" ||
    pet.birthdate === birthSearch;

  return matchesName && matchesBirth;
});

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

  const clearSearch = () => {
  setNameSearch("");
  setBirthSearch("");
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

<Box
  display="flex"
  gap={2}
  mb={3}
  flexWrap="wrap"
>
  <TextField
    label="Name"
    value={nameSearch}
    onChange={(e) =>
      setNameSearch(e.target.value)
    }
    size="small"
  />

  <TextField
    label="Birth Date"
    type="date"
    value={birthSearch}
    onChange={(e) =>
      setBirthSearch(e.target.value)
    }
    InputLabelProps={{
      shrink: true,
    }}
    size="small"
  />

  <Button
    variant="outlined"
    onClick={clearSearch}
  >
    Clear
  </Button>


</Box>
      <Typography mb={3}>
        Registered pets: {filteredPets.length}
      </Typography>

      <PetsList
        pets={filteredPets}
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