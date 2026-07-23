import { Box } from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import type { Pet } from "../models/Pet";
import { PET_TABLE_COLUMNS } from "./pets-table.columns";
import { germanDateFormatter } from "../../../shared/formatters";


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
  sex: pet.sex,
  weight: pet.weight,
  birthdate: germanDateFormatter(pet.birthdate),
  microchip_no: pet.microchip_no,
  color: pet.color,
  owner_id: pet.owner_id,
}));


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
  
  );
 
}