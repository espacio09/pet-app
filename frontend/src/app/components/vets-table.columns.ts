import type { GridColDef } from "@mui/x-data-grid";
export const VET_TABLE_COLUMNS: GridColDef[] = [
  {
    field: "vetId",
    headerName: "ID",
    width: 100,
  },
  {
    field: "firstName",
    headerName: "Nombre",
    minWidth: 150,
    flex: 1,
  },
  {
    field: "lastName",
    headerName: "Apellido",
    minWidth: 170,
    flex: 1,
  },
  {
    field: "address",
    headerName: "Dirección",
    minWidth: 180,
    flex: 1,
  },
  {
    field: "email",
    headerName: "Correo electrónico",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "phone",
    headerName: "Teléfono",
    minWidth: 140,
  },
];