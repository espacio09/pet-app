import { useEffect, useState } from "react";
import PetsList from "./pages/PetsPage/PetsList";
import type { Pet } from "./types/Pet";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    fetch("http://localhost:3002/pets")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        setPets(data);
      });
  }, []);

  const handleSelect = (pet: Pet) => {
    console.log("Seleccionado:", pet);
  };

  return (
    <div>
      <h1>Mascotas</h1>
      
      <p>Total pets: {pets.length}</p>   {/* 👈 AQUÍ */}

      <PetsList pets={pets} onSelect={handleSelect} />
    </div>
  );
}

export default App;