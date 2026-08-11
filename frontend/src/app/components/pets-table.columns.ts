import type { GridColDef } from "@mui/x-data-grid";
export const PET_TABLE_COLUMNS: GridColDef[] = [

  {
    field: "id",
    headerName: "Pet ID",
    width: 90,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },

   {
    field: "owner_id",
    headerName: "Owner ID",
    width: 200,
  },
{
    field: "birthdate",
    headerName: "Birthdate",
    width: 120,
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
    field: "color",
    headerName: "Color",
    width: 120,
  },
  {
    field: "microchip_no",
    headerName: "Microchip No",
    width: 180,
  },
  {
    field: "age",
    headerName: "Age",
    width: 100,
  },
];