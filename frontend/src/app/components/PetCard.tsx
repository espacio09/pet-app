import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import type { Pet } from "../types/Pet";

type PetCardProps = {
  pet: Pet;
  ownerName?: string;
  onSelect: () => void;
};

export default function PetCard({
  pet,
  ownerName,
  onSelect,
}: PetCardProps) {
  const resolvedOwnerName =
    ownerName?.trim() ||
    pet.ownerName?.trim() ||
    [pet.ownerFirstName, pet.ownerLastName].filter(Boolean).join(" ").trim() ||
    "Sin propietario";

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardActionArea
        aria-label={`Ver detalles de ${pet.petName}`}
        onClick={onSelect}
        sx={{ height: "100%" }}
      >
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {pet.petName}
          </Typography>
          <Typography variant="body2">
            <strong>Propietario:</strong> {resolvedOwnerName}
          </Typography>
          <Typography variant="body2">
            <strong>Microchip:</strong> {pet.microchip_no || "Sin registrar"}
          </Typography>
          <Typography variant="body2">
            <strong>Edad:</strong> {pet.age}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}