
import { Box } from "@mui/material";
import type { ReactNode } from "react";


  type Props = { children: ReactNode };

export default function PetsGrid({ children }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}
