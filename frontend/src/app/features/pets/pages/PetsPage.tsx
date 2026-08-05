import { useState } from "react";
import { usePets } from "./usePets";
import type { Pet } from "../models/Pet";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";
import { Button } from "@mui/material";



type PetsPageProps = {
  onGoHome: () => void;
};

export const PetsPage = ({
  onGoHome,
}: PetsPageProps) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  
  const { pets, loading, error, loadPets } = usePets();

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedPet(null);
  };

  const handleOpenAddPetDialog = () => {
  setIsAddPetOpen(true);
};

   const handleCloseAddPetDialog = () => {
  setIsAddPetOpen(false);
};

console.log("PETS EN PETSPAGE:", pets);
console.log("LOADING:", loading);
console.log("ERROR:", error);

  if (loading) {
    return <p>Cargando mascotas...</p>;
  }

  if (error) {
    return <p>Error al cargar mascotas.</p>;
  }

  return (
    <div>
      <h1>Mascotas</h1>

      <div style={{ marginBottom: "20px" }}>
  
 <div style={{ marginBottom: "20px" }}>
  <Button
    variant="outlined"
    onClick={onGoHome}
  >
    🏠 Home
  </Button>

  <Button
    variant="contained"
    onClick={handleOpenAddPetDialog}
    style={{ marginLeft: "10px" }}
  >
    🐾 Add Pet
  </Button>
</div>
</div>

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
    </div>
  );
};