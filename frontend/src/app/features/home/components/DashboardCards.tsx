import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useOwners } from "../../../hooks/useOwners";

type DashboardCardsProps = {
  onOpenPets: () => void;
  onOpenOwners: () => void;
};

export default function DashboardCards({
  onOpenPets,
  onOpenOwners,
}: DashboardCardsProps) {
  const { owners } = useOwners();

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
    {
      title: "Propietarios",
      value: owners.length,
      icon: "👥",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 2.4 }}
          key={card.title}
        >
          <Card
            sx={{
              borderRadius: 4,
              textAlign: "center",
              height: "100%",
              boxShadow: 3,
              cursor:
                card.title === "Patients" || card.title === "Propietarios"
                  ? "pointer"
                  : "default",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardActionArea
              disabled={card.title !== "Patients" && card.title !== "Propietarios"}
              onClick={() => {
                if (card.title === "Patients") {
                  onOpenPets();
                } else if (card.title === "Propietarios") {
                  onOpenOwners();
                }
              }}
              sx={{ height: "100%" }}
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
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}