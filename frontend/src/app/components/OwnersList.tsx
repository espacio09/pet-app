import { Box, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Owner } from "../types/Owner";
import { OWNER_TABLE_COLUMNS } from "./owners-table.columns";

interface OwnersProps {
  owners: Owner[];
  onSelect: (owner: Owner) => void;
  selectedOwnerIds: number[];
  onSelectionChange: (ownerIds: number[]) => void;
}

export default function OwnersList({
  owners,
  onSelect,
  selectedOwnerIds,
  onSelectionChange,
}: OwnersProps) {
  const rows = [...owners]
    .sort((firstOwner, secondOwner) => {
      const lastNameOrder = (firstOwner.lastName ?? firstOwner.last_name ?? "")
        .localeCompare(
          secondOwner.lastName ?? secondOwner.last_name ?? "",
          undefined,
          { sensitivity: "base" },
        );

      return lastNameOrder ||
        (firstOwner.firstName ?? firstOwner.first_name ?? "").localeCompare(
          secondOwner.firstName ?? secondOwner.first_name ?? "",
          undefined,
          { sensitivity: "base" },
        );
    })
    .map((owner) => ({
      id: owner.ownerId,
      ownerId: owner.ownerId,
      firstName: owner.firstName ?? owner.first_name ?? "",
      lastName: owner.lastName ?? owner.last_name ?? "",
      address: owner.address ?? "",
      phone: owner.phone ?? "",
      email: owner.email ?? "",
    }));
  const columns = [
    {
      field: "select",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: { ownerId: number; firstName: string; lastName: string } }) => {
        const ownerId = Number(params.row.ownerId);
        const isSelected = selectedOwnerIds.includes(ownerId);

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
                ? [...selectedOwnerIds, ownerId]
                : selectedOwnerIds.filter((id) => id !== ownerId);
              onSelectionChange(nextSelection);
            }}
          />
        );
      },
    },
    ...OWNER_TABLE_COLUMNS,
  ];

  return (
    <Box sx={{ height: 420, width: "100%" }}>
      <DataGrid
        aria-label="Lista de propietarios"
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        pageSizeOptions={[25, 50, 100]}
        onRowClick={(params) => {
          const selectedOwner = owners.find(
            (candidate) => candidate.ownerId === params.row.ownerId,
          );
          if (selectedOwner) onSelect(selectedOwner);
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