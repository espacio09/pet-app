import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function DashboardCards() {
  const cards = [
    {
      title: "Appointments",
      value: 3,
      icon: "📅",
    },
    {
      title: "Vaccinations",
      value: 2,
      icon: "💉",
    },
    {
      title: "Patients",
      value: 15,
      icon: "🐾",
    },
    {
      title: "Follow-Ups",
      value: 1,
      icon: "⚠️",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
          <Card
            sx={{
              borderRadius: 4,
              textAlign: "center",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h3">
                {card.icon}
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
              >
                {card.value}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
              >
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}