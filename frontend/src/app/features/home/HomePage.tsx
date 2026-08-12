import { Box, Container, Paper } from "@mui/material";
import WelcomeSection from "./components/WelcomeSection";
import DashboardCards from "./components/DashboardCards";
import HeroImage from "./components/HeroImage";


export default function HomePage() {
  return (
    <Box
  sx={{
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f5fdfb 0%, #e8f6ff 50%, #f0fff4 100%)",
    py: 4,
  }}
>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          <WelcomeSection />
          <DashboardCards />
          <HeroImage />
        </Paper>
      </Container>
    </Box>
  );
}