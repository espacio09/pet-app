import { Box, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Vet } from "../types/Vet";
import { VET_TABLE_COLUMNS } from "./vets-table.columns";

interface VetsProps {
  vets: Vet[];
  onSelect: (vet: Vet) => void;
  selectedVetIds: number[];
  onSelectionChange: (vetIds: number[]) => void;
}

export default function VetsList({
  vets,
  onSelect,
  selectedVetIds,
  onSelectionChange,
}: VetsProps) {
  const rows = [...vets]
    .sort((firstVet, secondVet) => {
      const lastNameOrder = (firstVet.lastName ?? firstVet.last_name ?? "")
        .localeCompare(
          secondVet.lastName ?? secondVet.last_name ?? "",
          undefined,
          { sensitivity: "base" },
        );

      return lastNameOrder ||
        (firstVet.firstName ?? firstVet.first_name ?? "").localeCompare(
          secondVet.firstName ?? secondVet.first_name ?? "",
          undefined,
          { sensitivity: "base" },
        );
    })
    .map((vet) => ({
      id: vet.vetId,
      vetId: vet.vetId,
      firstName: vet.firstName ?? vet.first_name ?? vet.name ?? "",
      lastName: vet.lastName ?? vet.last_name ?? "",
      address: vet.address ?? "",
      phone: vet.phone ?? vet.phoneNumber ?? "",
      email: vet.email ?? "",
    }));
  const columns = [
    {
      field: "select",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: { vetId: number; firstName: string; lastName: string } }) => {
        const vetId = Number(params.row.vetId);
        const isSelected = selectedVetIds.includes(vetId);

        return (
          <Checkbox
            checked={isSelected}
            slotProps={{
              input: {
                "aria-label": `Seleccionar ${params.row.firstName} ${params.row.lastName}`,
              },
            }}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              const nextSelection = event.target.checked
                ? [...selectedVetIds, vetId]
                : selectedVetIds.filter((id) => id !== vetId);
              onSelectionChange(nextSelection);
            }}
          />
        );
      },
    },
    ...VET_TABLE_COLUMNS,
  ];

  return (
    <Box sx={{ height: 420, width: "100%" }}>
      <DataGrid
        aria-label="Lista de veterinarios"
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        onRowClick={(params) => {
          const selectedVet = vets.find(
            (candidate) => candidate.vetId === params.row.vetId,
          );
          if (selectedVet) onSelect(selectedVet);
        }}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#73aafe",
            color: "black",
          },
          "& .MuiDataGrid-row": { cursor: "pointer" },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#fff2b2",
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#f6b4b4",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#bbdefb",
          },
        }}
      />
    </Box>
  );
}