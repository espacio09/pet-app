import { useState } from "react";
import { usePets } from "./hooks/usePets";
import type { Pet } from "./types/Pet";
import { PetList } from "./PetsList";
import { PetDetailModal } from "./PetDetailModal";

export const PetsPage = () => {
  const { pets, loading, error } = usePets();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDetailOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedPet(null);
  };

  if (loading) return <p>Cargando mascotas...</p>;
  if (error) return <p>Error al cargar mascotas</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mascotas</h1>

      <PetList pets={pets} onSelect={handleSelectPet} />

      <PetDetailModal
        pet={selectedPet}
        open={isDetailOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};