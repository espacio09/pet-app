import { useState } from "react";
import { PetsPage } from "./app/features/pets/pages/PetsPage";
import HomePage from "./app/pages/HomePage";




function App() {
  const [activePage, setActivePage] =
    useState("home");

  if (activePage === "pets") {
    return (
  <PetsPage
    onGoHome={() => setActivePage("home")}
  />
);
  }

  return (
    <HomePage
      onOpenPets={() => setActivePage("pets")}
    />
  );
}

export default App;