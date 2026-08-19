import { useState } from "react";
import { PetsPage } from "./app/pages/PetsPage";
import HomePage from "./app/features/home/HomePage";

type Page = "home" | "pets";

function App() {
  const [activePage, setActivePage] =
    useState<Page>("home");

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