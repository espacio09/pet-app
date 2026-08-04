import { Card, CardContent, Typography } from "@mui/material";

interface HomePageProps {
  onOpenPets: () => void;
}

export default function HomePage({ onOpenPets }: HomePageProps) {
  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        🐾 Welcome to Pet Care Manager
      </Typography>

      <Typography variant="body1" gutterBottom>
        Please Select a module to continue.

      </Typography>

      <Card sx={{ mt: 2, cursor: "pointer" }} onClick={onOpenPets}>
        <CardContent>
          <Typography variant="h6">
            🐾 Pets
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">
            👨 Owners
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">
            🩺 Vets
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}