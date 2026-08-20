import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import type { Pet } from "../types/Pet";
import { usePets } from "../hooks/usePets";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";

type PetsPageProps = {
  onGoHome: () => void;
};

export const PetsPage = ({
  onGoHome,
}: PetsPageProps) => {
  const [selectedPet, setSelectedPet] =
    useState<Pet | null>(null);

  const [isAddPetOpen, setIsAddPetOpen] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [birthdate, setBirthdate] = useState("");

  const [searchOwner, setSearchOwner] = useState("");


  const {
    pets,
    loading,
    error,
    loadPets,
  } = usePets();


  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      searchTerm === "" ||
      pet.petName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());


  const filteredPetsByOwner = pets.filter((pet) => {
  const owner = owners.find(
    o => o.ownerId === pet.ownerId
  );

  const ownerName =
    `${owner?.firstName ?? ""} ${owner?.lastName ?? ""}`;

  return ownerName
    .toLowerCase()
    .includes(searchOwner.toLowerCase());
});


// Function to format the date in German format (dd.mm.yyyy)
  const formatGermanDate = (date: string | Date) =>
  new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));

const matchesBirth =
  birthdate.trim() === "" ||
  formatGermanDate(pet.birthdate) === birthdate.trim();


    return (
      matchesSearch && matchesBirth
     );
  });



  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  const clearSearch = () => {
    setSearchTerm("");
    setBirthdate("");
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
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 2 }}
      >
        Mis Mascotas
      </Typography>

      <Button
        variant="outlined"
        onClick={onGoHome}
      >
        Home
      </Button>

      <Button
        variant="contained"
        sx={{ ml: 1 }}
        onClick={() =>
          setIsAddPetOpen(true)
        }
      >
        Add Pet
      </Button>

      <Box
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search Pet"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

       <TextField
  label="Birthdate"
  value={birthdate}
  placeholder="15.10.2000"
  onChange={(e) =>
    setBirthdate(e.target.value)
  }

/>
return (
  <>

    return (
  <>
    <TextField
      label="Search Owner"
      value={searchOwner}
      onChange={(e) =>
        setSearchOwner(e.target.value)
      }
    />

    {filteredPetsByOwner.map((pet) => {
      const owner = owners.find(
        o => o.ownerId === pet.ownerId
      );

      return (
        <div key={pet.petId}>
          {pet.name} - {owner?.firstName}
        </div>
      );
    })}
  </>
);

  </>
);
        <Button
          variant="outlined"
          onClick={clearSearch}
        >
          Clear
        </Button>
      </Box>

      <Typography variant="h6">
        Registered pets:
        {" "}
        {filteredPets.length}
      </Typography>

      <PetsList
        pets={filteredPets}
        onSelect={(pet) => {
          setSelectedPet(pet);
          handleOpenModal();
        }}
      />

      <AddPetDialog
        open={isAddPetOpen}
        onClose={() =>
          setIsAddPetOpen(false)
        }
        onPetAdded={loadPets}
      />

      <PetDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSaved={loadPets}
        pet={selectedPet}
      />
    </Box>
  );
};