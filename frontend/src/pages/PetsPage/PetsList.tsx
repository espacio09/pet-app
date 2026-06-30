import type { Pet } from "./types/Pet";
import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

export default function PetsTable({ pets }: { pets: Pet[] }) {
  const safePets = Array.isArray(pets) ? pets : [];

 const rows = safePets.map((pet: any, index) => ({
  id: pet.pet_id ?? pet.petId ?? index,
  name: pet.pet_name ?? pet.name ?? pet.petName ?? "No name",
  type: pet.pet_type_id ?? pet.petTypeId ?? "Unknown",
  birthDate: pet.birthDate ?? "Unknown"

}));


  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "birthDate", headerName: "Birth Date", width: 150 }
  ];

  console.log("pets:", pets);
  console.log("rows:", rows);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
