import { Box } from "@mui/material";

export default function HeroImage() {
  return (
    <Box
      component="img"
      src="/images/petcare-hero.jpg"
      alt="PetCare Hero"
      sx={{
        width: "100%",
        maxHeight: 350,
        objectFit: "cover",
        borderRadius: 4,
        mt: 4,
        mb: 4,
        boxShadow: 3,
      }}
    />
  );
}