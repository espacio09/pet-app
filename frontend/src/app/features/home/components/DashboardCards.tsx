import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";



type DashboardCardsProps = {
  onOpenPets: () => void;
};

export default function DashboardCards({
  onOpenPets,
}: DashboardCardsProps) {


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
  onClick={() => {
    if (card.title === "Patients") {
      onOpenPets();
    }
  }}
  sx={{
    borderRadius: 4,
    textAlign: "center",
    height: "100%",
    boxShadow: 3,
    cursor: card.title === "Patients"
      ? "pointer"
      : "default",

    transition: "all 0.3s ease",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: 6,
    },
  }}
>
            <CardContent>
              <Typography variant="h3">
                {card.icon}
              </Typography>

             <Typography
  variant="h4"
  color="primary"
  sx={{ fontWeight: 700 }}
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