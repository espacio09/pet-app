import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { useOwners } from "../../../hooks/useOwners";
import { useVets } from "../../../hooks/useVets";
import { usePets } from "../../../hooks/usePets";
import { useAppointments } from "../../../hooks/useAppointments";

export default function DashboardCards() {
  const { owners } = useOwners();
  const { vets } = useVets();
  const { pets } = usePets();
  const {
    appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();

  const cards = [
    {
      title: "Appointments",
      value: appointmentsLoading
        ? "..."
        : appointmentsError
          ? "!"
          : appointments.length,
      icon: "📅",
      to: "/appointments",
    },
    {
      title: "Vaccinations",
      value: 2,
      icon: "💉",
    },
    {
      title: "Patients",
      value: pets.length,
      icon: "🐾",
      to: "/pets",
    },
    {
      title: "Follow-Ups",
      value: 1,
      icon: "⚠️",
    },
    {
      title: "Proprietarios",
      value: owners.length,
      icon: "👥",
      to: "/owners",
    },
    {
      title: "Veterinários",
      value: vets.length,
      icon: "👨‍⚕️",
      to: "/vets",
    }
  ];

  return (
    <>
      {appointmentsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {appointmentsError}
        </Alert>
      )}
      <Grid container spacing={3}>
        {cards.map((card) => {
          const content = (
            <CardContent>
              <Typography variant="h3">{card.icon}</Typography>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: 700 }}
              >
                {card.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {card.title}
              </Typography>
            </CardContent>
          );

          return (
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={card.title}>
              <Card
                sx={{
                  borderRadius: 4,
                  textAlign: "center",
                  height: "100%",
                  boxShadow: 3,
                  cursor: card.to ? "pointer" : "default",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                {card.to ? (
                  <CardActionArea
                    component={Link}
                    to={card.to}
                    sx={{ height: "100%" }}
                  >
                    {content}
                  </CardActionArea>
                ) : (
                  <CardActionArea disabled sx={{ height: "100%" }}>
                    {content}
                  </CardActionArea>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}