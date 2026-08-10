import { useState } from "react";
import { usePets } from "./usePets";
import type { Pet } from "../models/Pet";

import PetsList from "../components/PetsList";
import PetDetailModal from "../components/PetDetailModal";
import AddPetDialog from "../components/AddPetDialog";
import {
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PetsIcon from "@mui/icons-material/Pets";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import vetAvatar from "../../../../assets/vet-avatar.jpg";



type PetsPageProps = {
  onGoHome: () => void;
};

export const PetsPage = ({
  onGoHome,
}: PetsPageProps) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  
  const { pets, loading, error, loadPets } = usePets();

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedPet(null);
  };

  const handleOpenAddPetDialog = () => {
  setIsAddPetOpen(true);
};

   const handleCloseAddPetDialog = () => {
  setIsAddPetOpen(false);
};

console.log("PETS EN PETSPAGE:", pets);
console.log("LOADING:", loading);
console.log("ERROR:", error);

  if (loading) {
    return <p>Cargando mascotas...</p>;
  }

  if (error) {
    return <p>Error al cargar mascotas.</p>;
  }

  return (
  <div>
    <h1>Mascotas</h1>

    <div style={{ marginBottom: "20px" }}>
<Button
  variant="outlined"
  size="small"
  startIcon={<HomeIcon />}
  onClick={onGoHome}
>
  Home
</Button>

<Button
  variant="contained"
  size="small"
  startIcon={<AddIcon />}
  onClick={handleOpenAddPetDialog}
  sx={{ ml: 1 }}
>
  Add Pet
</Button>

    </div>

   {/* Dashboard Header */}

<Paper
  elevation={2}
  sx={{
    p: 4,
    mb: 4,
    borderRadius: 3,
  }}
>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 3,
  }}
>
  <Avatar
    src={vetAvatar}
    alt="Dr. Smith"
    sx={{
      width: 56,
      height: 56,
    }}
  />
  <Typography
    variant="h5"
    fontWeight="bold"
  >
    Welcome back, Dr. Smith
  </Typography>
</Box>


    <Typography
      variant="subtitle1"
      color="text.secondary"
    >
      Your veterinary practice in one place
    </Typography>


  <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <CalendarMonthIcon
            color="primary"
            sx={{ fontSize: 15, mb: 1 }}
          />

          <Typography
            variant="h4"
            color="primary"
            fontWeight="bold"
          >
            12
          </Typography>

          <Typography color="text.secondary">
            Appointments Today
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <PetsIcon
            color="success"
            sx={{ fontSize: 20, mb: 1 }}
          />

          <Typography
            variant="h4"
            color="success.main"
            fontWeight="bold"
          >
            148
          </Typography>

          <Typography color="text.secondary">
            Active Patients
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    <Grid item xs={12} md={4}>
      <Card>
        <CardContent>
          <ReceiptLongIcon
            color="warning"
            sx={{ fontSize: 20, mb: 1 }}
          />

          <Typography
            variant="h4"
            color="warning.main"
            fontWeight="bold"
          >
            5
          </Typography>

          <Typography color="text.secondary">
            Pending Invoices
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Paper>


    <PetsList
      pets={pets}
      onSelect={(pet) => {
        setSelectedPet(pet);
        setIsDetailOpen(true);
      }}
    />

    <AddPetDialog
      open={isAddPetOpen}
      onClose={handleCloseAddPetDialog}
    />

    <PetDetailModal
      pet={selectedPet}
      open={isDetailOpen}
      onClose={handleCloseModal}
      onSaved={loadPets}
    />
  </div>
);}
