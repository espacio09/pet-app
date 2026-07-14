import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import { PetDto } from "../../app/models/pet.dto";
import { PetService } from "../../app/services/pet.service";
import { formatBirthDate } from "../../app/utils/date.utils";

export default function PetsList() {

  // ✅ State tipado → NO any
  const [pets, setPets] = useState<PetDto[]>([]);

  // ✅ Cargar datos desde backend (via service + mapper)
  useEffect(() => {
    PetService.getPets().then(setPets);
  }, []);

  /* // Test
  const rows = [
  { id: 1, name: "Test", type: "Dog", birthDate: "2020-01-01" }
]; */


  // ✅ Transformación para DataGrid (ya limpio)
  const rows = pets.map((pet) => ({
    id: pet.petId,
    name: pet.petName,
    type: pet.petTypeId,
    birthDate: formatBirthDate(pet.birthDate),
  }));
  
  console.log("Pets (DTO):", pets);


  // ✅ Columnas
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "birthDate", headerName: "Birth Date", width: 150 }
  ];

  // ✅ Render
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
      />
    </Box>
  );
}