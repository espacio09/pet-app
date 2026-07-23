import { useState } from "react";
import { usePets } from "./usePets";
import type { Pet } from "../models/Pet";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";
import { Button } from "@mui/material";



export const PetsPage = () => {
  const { pets, loading, error } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);


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

    

      <Button
  variant="contained"
  onClick={handleOpenAddPetDialog}
>
  Add Pet
</Button>



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
      />
    </div>
  );
};
