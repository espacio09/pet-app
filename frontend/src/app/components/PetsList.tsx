import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Pet } from "../types/Pet";


interface PetsListProps {
  pets: Pet[];
  onSelect: (pet: Pet) => void;
}

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Pet ID",
    width: 250,
  },
  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "sex",
    headerName: "Sex",
    width: 120,
  },
  {
    field: "weight",
    headerName: "Weight",
    width: 120,
  },
  {
    field: "birthdate",
    headerName: "Birthdate",
    width: 180,
  },
];


export default function PetsList({
  pets,
  onSelect,
}: PetsListProps) {



const rows = pets.map((pet) => ({
  id: pet.petId,
  name: pet.petName,
  sex: pet.sex,
  weight: pet.weight,
  birthdate: new Date(pet.birthdate).toLocaleDateString("de-DE"),
}));


  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(params) => {
         const pet = pets.find(
        (p) => p.petId === params.row.id
);

          if (pet) {
            onSelect(pet);
          }
        }}
      />
    </Box>
  
  );
 
}