import { useState } from "react";
import { usePets } from "../pages/PetsPage/hooks/usePets";

import type { Pet } from "../types/Pet";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";



export const PetsPage = () => {
  const { pets, loading, error } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);


  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedPet(null);
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

  <PetsList
    pets={pets}
    onSelect={(pet) => {
      console.log("Mascota seleccionada:", pet);
    }}
  />
 
      <PetDetailModal
        pet={selectedPet}
        open={isDetailOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
