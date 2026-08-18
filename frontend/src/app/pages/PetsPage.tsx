import { useState } from "react";
import type { Pet } from "../types/Pet";
import { usePets } from "../hooks/usePets";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";

type PetsPageProps = {
  onGoHome: () => void;
};

export const PetsPage = ({ onGoHome }: PetsPageProps) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [birthSearch, setBirthSearch] = useState("");

  const { pets, loading, error, loadPets } = usePets();

  const handleSaved = async (): Promise<void> => {
  await loadPets();
};

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      searchTerm === "" ||
      pet.petName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesName =
      nameSearch === "" ||
      pet.petName
        .toLowerCase()
        .includes(nameSearch.toLowerCase());

  const matchesBirth =
  birthSearch === "" ||
  pet.birthdate.toISOString().split("T")[0] === birthSearch;


    return (
      matchesSearch &&
      matchesName &&
      matchesBirth
    );
  });

const [modalOpen, setModalOpen] = useState(false);

const handleOpenModal = () => {
  setModalOpen(true);
};

const handleCloseModal = () => {
  setModalOpen(false);
};




  const handleOpenAddPetDialog = () => {
    setIsAddPetOpen(true);
  };

  const handleCloseAddPetDialog = () => {
    setIsAddPetOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setNameSearch("");
    setBirthSearch("");
  
};

  if (loading) {
    return (
      <Typography>
        Cargando mascotas...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography>
        Error al cargar mascotas.
      </Typography>
    );
  }

  return (

    <Box
    sx={{
    display: "flex",
    gap: 2,
    mb: 2,
    flexWrap: "wrap",
  }}
>


   <Typography
  variant="h4"
  sx={{ mb: 2 }}
>
  Mis Mascotas
</Typography>

      <Box
    sx={{
    display: "flex",
    gap: 2,
    mb: 2,
    flexWrap: "wrap",
  }}
>

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
  sx={{
    display: "flex",
    gap: 2,
    mb: 2,
    flexWrap: "wrap",
  }}

      >
        <TextField
          label="Search Pet"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          size="small"
        />

        <TextField
          label="Name"
          value={nameSearch}
          onChange={(e) =>
            setNameSearch(e.target.value)
          }
          size="small"
        />

       <PetDetailModal
  open={modalOpen}
  onClose={handleCloseModal}
  onSaved={loadPets}
  pet={selectedPet}
/>


        <Button
          variant="outlined"
          onClick={clearSearch}
        >
          Clear
        </Button>
      </Box>

        <Typography
  variant="h4"
  sx={{ mb: 2 }}
>
        Registered pets: {filteredPets.length}
      </Typography>

      {filteredPets.length === 0 && (
        <Typography color="error">
          No hay mascotas que coincidan con la búsqueda.
        </Typography>
      )}

      <PetsList
        pets={filteredPets}
        onSelect={(pet) => {
          setSelectedPet(pet);
          handleOpenModal();
        }}
      />

      <AddPetDialog
        open={isAddPetOpen}
        onClose={handleCloseAddPetDialog}
        onPetAdded={loadPets}
      />  

     <PetDetailModal
  open={modalOpen}
  onClose={handleCloseModal}
  onSaved={handleSaved}
  pet={selectedPet}
/>

    </Box>
  );
}