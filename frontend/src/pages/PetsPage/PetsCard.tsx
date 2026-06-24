import { Card, CardContent, Typography } from "@mui/material";

type Pet = {
  pet_id: number;
  pet_name: string;
  pet_type_id: number;
  sex: string;
  breed_id: number;
};

type Props = {
  pet: Pet;
};

export default function PetsCard({ pet }: Props) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">{pet.pet_name}</Typography>

        <Typography color="text.secondary">
          Tipo ID: {pet.pet_type_id}
        </Typography>

        <Typography color="text.secondary">
          Sexo: {pet.sex}
        </Typography>

        <Typography color="text.secondary">
          Breed ID: {pet.breed_id}
        </Typography>
      </CardContent>
    </Card>
  );
}
