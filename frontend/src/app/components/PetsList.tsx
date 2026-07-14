import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import type { Pet } from "../types/Pet";
import { formatBirthDate } from "../utils/date.utils";

interface PetsListProps {
  pets: Pet[];
  onSelect: (pet: Pet) => void;
}


export default function PetsList({
  pets,
  onSelect,
}: PetsListProps) {
  const rows = pets.map((pet) => ({
    id: pet.petId,
    name: pet.petName,
    type: pet.pet_type_id,
    birthDate: formatBirthDate(pet.birthDate),
    originalPet: pet,
  }));

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
    },
    {
      field: "birthDate",
      headerName: "Birth Date",
      width: 150,
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={(params) => {
          onSelect(params.row.originalPet);
        }}
      />
    </Box>
  );
}