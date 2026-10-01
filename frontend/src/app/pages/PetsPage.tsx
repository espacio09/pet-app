import { useState } from "react";
import {
  Autocomplete,
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

import { useOwners } from "../hooks/useOwners";




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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPet(null);
  };

  const [modalOpen, setModalOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [birthdate, setBirthdate] = useState("");

  const [searchOwner, setSearchOwner] = useState("");

  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);


  const {
    pets,
    loading,
    error,
    loadPets,
  } = usePets();

  const {
    owners,
    loading: ownersLoading,
    error: ownersError,
  } = useOwners();

  const ownerOptions = owners
    .map((owner) => ({
      ownerId: owner.ownerId,
      label: `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim(),
      lastName: owner.lastName ?? "",
      firstName: owner.firstName ?? "",
    }))
    .filter((owner, index, ownersList) =>
      ownersList.findIndex((candidate) => candidate.label === owner.label) === index
    )
    .sort((firstOwner, secondOwner) => {
      const lastNameOrder = firstOwner.lastName.localeCompare(
        secondOwner.lastName,
        undefined,
        {
        sensitivity: "base",
        }
      );

      return lastNameOrder !== 0
        ? lastNameOrder
        : firstOwner.firstName.localeCompare(secondOwner.firstName, undefined, {
            sensitivity: "base",
          });
    })
            ;

  const petOptions = pets
    .map((pet) => pet.petName)
    .filter((petName, index, names) => names.indexOf(petName) === index)
    .sort((firstPet, secondPet) =>
      firstPet.localeCompare(secondPet, undefined, {
        sensitivity: "base",
      })
    );



  const formatDateInput = (date: string | Date) =>
    new Date(date).toISOString().slice(0, 10);


const getPetOwnerName = (pet: Pet) => {
  const owner = owners.find((candidate) => candidate.ownerId === pet.ownerId);

  return (
    pet.ownerName?.trim() ||
    `${pet.ownerFirstName ?? owner?.firstName ?? ""} ${
      pet.ownerLastName ?? owner?.lastName ?? ""
    }`.trim()
  );
};

const filteredPets = pets.filter((pet) => {
  const matchesSearch =
    searchTerm === "" ||
    pet.petName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesBirth =
    birthdate.trim() === "" ||
    formatDateInput(pet.birthdate) === birthdate.trim();

  const normalizedOwnerName = getPetOwnerName(pet).toLowerCase().trim();
  const normalizedSearchOwner = searchOwner.toLowerCase().trim();

  const matchesOwner =
    selectedOwnerId !== null
      ? String(pet.ownerId) === String(selectedOwnerId) ||
        normalizedOwnerName === normalizedSearchOwner
      : searchOwner === "" ||
        normalizedOwnerName.includes(normalizedSearchOwner);

  return (
    matchesSearch &&
    matchesBirth &&
    matchesOwner
  );
}).sort((firstPet, secondPet) =>
  firstPet.petName.localeCompare(secondPet.petName, undefined, {
    sensitivity: "base",
  })
);



  const clearSearch = () => {
    setSearchTerm("");
    setBirthdate("");
    setSearchOwner("");
    setSelectedOwnerId(null);
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
        <Autocomplete
          options={ownerOptions}
          value={
            ownerOptions.find((owner) => owner.label === searchOwner) ?? null
          }
          inputValue={searchOwner}
          getOptionLabel={(option) => option.label}
          onChange={(_, value) => {
            setSearchOwner(value?.label ?? "");
            setSelectedOwnerId(value?.ownerId ?? null);
          }}
          onInputChange={(_, value, reason) => {
            if (reason === "input" || reason === "clear") {
              setSearchOwner(value);
              setSelectedOwnerId(null);
            }
          }}
          disabled={ownersLoading || Boolean(ownersError)}
          sx={{ minWidth: 220 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Owner"
              autoComplete="off"
            />
          )}
        />

        <Autocomplete
          options={petOptions}
          value={petOptions.includes(searchTerm) ? searchTerm : null}
          inputValue={searchTerm}
          onChange={(_, value) => setSearchTerm(value ?? "")}
          onInputChange={(_, value, reason) => {
            if (reason === "input" || reason === "clear") {
              setSearchTerm(value);
            }
          }}
          sx={{ minWidth: 220 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Pet"
              autoComplete="off"
            />
          )}
        />

        <TextField
          label="Birthday"
          value={birthdate}
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          sx={{
            minWidth: 220,
            "& input[type=date]:invalid::-webkit-datetime-edit": {
              color: "transparent",
            },
            "& input[type=date]:focus::-webkit-datetime-edit": {
              color: "inherit",
            },
          }}
          onChange={(e) => setBirthdate(e.target.value)}
        />
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
        owners={owners}
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
}