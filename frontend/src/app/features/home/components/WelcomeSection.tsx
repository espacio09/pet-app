import { Box, Typography } from "@mui/material";

export default function WelcomeSection() {
  return (
    <Box sx={{ mb: 4 }}>
     <Typography
variant="h4"
color="primary"
gutterBottom
sx={{ fontWeight: 'bold' }}
>
        🐾 Bienvenida Dra. Smith!
      </Typography>

      <Typography variant="h6" color="text.secondary">
        Tus pacientes te están esperando hoy.
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        Aquí tienes una vista general de tu agenda y prioridades.
      </Typography>
    </Box>
  );
}