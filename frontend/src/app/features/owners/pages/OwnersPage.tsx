import { useState } from "react";
import { usePets } from "./useOwners";
import type { Pet } from "../models/Owner";

import PetsList from "../components/OwnerList";
import PetDetailModal from "../components/OwnerDetailModal";
import AddPetDialog from "../components/AddOwnerDialog";
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
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import vetAvatar from "../../../../assets/vet-avatar.png";



type OwnersPageProps = {
  onGoHome: () => void;
};

export const OwnersPage = ({
  onGoHome,
}: OwnersPageProps) => {
  const [selectedPet, setSelectedPet] = useState<Owner | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  
  const { pets, loading, error, loadPets } = useOwners();

  const handleCloseModal = () => {
    setIsDetailOpen(false);
    setSelectedPet(null);
  };

  const handleOpenAddOwnerDialog = () => {
  setIsAddPetOpen(true);
};

   const handleCloseAddOwnerDialog = () => {
  setIsAddPetOpen(false);
};

console.log("OWNERS EN OWNERSPAGE:", owners);
console.log("LOADING:", loading);
console.log("ERROR:", error);

  if (loading) {
    return <p>Cargando propietarios...</p>;
  }

  if (error) {
    return <p>Error al cargar propietarios.</p>;
  }

  return (
  <div>
    <h1>Propietarios</h1>

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
  onClick={handleOpenAddOwnerDialog}
  sx={{ ml: 1 }}
>
  Add Owner
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
    src={ownerAvatar}
    alt="Dr. Smith"
    sx={{
      width: 100,
      height: 100,
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
            variant="h5"
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
            variant="h5"
            color="success.main"
            fontWeight="bold"
          >
            {pets.length}
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
          <PeopleIcon
            color="success"
            sx={{ fontSize: 20, mb: 1 }}
          />

          <Typography
            variant="h5"
            color="success.main"
            fontWeight="bold"
          >
            {owners.length}
          </Typography>

          <Typography color="text.secondary">
            Owners Registered
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
            variant="h5"
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
