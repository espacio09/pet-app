import type { Pet } from "./types/Pet";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function PetsTable({ pets }: { pets: Pet[] }) {
  const safePets = Array.isArray(pets) ? pets : [];

  const rows = safePets.map((pet, index) => ({
    id: pet.petId ?? index,
    name: pet.petName ?? "No name",
    type: pet.pet_type_id ?? "Unknown"
  }));

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "type", headerName: "Type", width: 150 }
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