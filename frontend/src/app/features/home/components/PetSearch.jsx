export default function PetSearch() {
  const [nameSearch, setNameSearch] = React.useState("");
const [birthSearch, setBirthSearch] = React.useState("");

  const pets = [
  {
    id: 1,
    name: "Einstein",
    birthDate: "2025-04-12",
    species: "Rata"
  },
  {
    id: 2,
    name: "Luna",
    birthDate: "2024-08-15",
    species: "Gato"
  }
];

 const filteredPets = pets.filter((pet) => {
  const matchesName =
    pet.name.toLowerCase().includes(nameSearch.toLowerCase());

  const matchesBirth =
    birthSearch === "" ||
    pet.birthDate === birthSearch;

  return matchesName && matchesBirth;
});

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        🐾 Pet-App
      </h1>

      <input
  type="text"
  placeholder="Nombre"
  value={nameSearch}
  onChange={(e) => setNameSearch(e.target.value)}
/>

<input
  type="date"
  value={birthSearch}
  onChange={(e) => setBirthSearch(e.target.value)}
/>

      <div className="space-y-2">
        {filteredPets.map((pet) => (
          <div
            key={pet.id}
            className="border rounded-lg p-3 bg-white"
          >
            <strong>{pet.name}</strong>
            <div>{pet.species}</div>
          </div>
        ))}

        {filteredPets.length === 0 && (
          <div className="text-gray-500">
            No se encontraron mascotas.
          </div>
        )}
      </div>
    </div>
  );
}
