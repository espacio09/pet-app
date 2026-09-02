import { Box } from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import type { Pet } from "./../types/Pet";
import { PET_TABLE_COLUMNS } from "./pets-table.columns";
import { germanDateFormatter } from "./../shared/formatters";
import type { Owner } from "../types/Owner";


interface PetsListProps {
  pets: Pet[];
  owners: Owner[];
  onSelect: (pet: Pet) => void;
}


export default function PetsList({
  pets,
  owners,
  onSelect: onSelect,
}: PetsListProps) {

const rows = pets.map((pet) => {
  const owner = owners.find(
    (o) => o.ownerId === pet.ownerId
  );


  
  console.log(
    "Pet:",
    pet.petName,
    "pet.ownerId:",
    pet.ownerId,
    "tipo:",
    typeof pet.ownerId
  );
  
  owners.forEach((o) =>
    console.log(
      "Owner:",
      o.ownerId,
      "tipo:",
      typeof o.ownerId
    )
  );
  
  return {
    id: pet.petId,
    name: pet.petName,
    ownerFirstName: owner?.firstName ?? "",
    ownerLastName: owner?.lastName ?? "",
    ownerName: owner
      ? `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim()
      : "Sin propietario",
    sex: pet.sex,
    weight: pet.weight,
    birthdate: germanDateFormatter(pet.birthdate),
    microchip_no: pet.microchip_no,
    color: pet.color,
    owner_id: pet.ownerId,
  };
});

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={PET_TABLE_COLUMNS}

        
sx={{
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#73aafe",
    color: "black",
  },

  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "#eaf826",
  },

  "& .MuiDataGrid-row:nth-of-type(odd)": {
    backgroundColor: "#d30f0f",
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#0eb6f3",
  },
}}

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
  
  );}