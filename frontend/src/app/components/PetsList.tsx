import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Pet } from "../types/Pet";

interface PetsListProps {
  pets: Pet[];
  onSelect: (pet: Pet) => void;
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
];

export default function PetsList({
  pets,
  onSelect,
}: PetsListProps) {
  const rows = pets.map((pet) => ({
    id: pet.petId,
    name: pet.petName,
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