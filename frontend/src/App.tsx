import { lazy, Suspense, useState } from "react";
import HomePage from "./app/features/home/HomePage";

const PetsPage = lazy(() =>
  import("./app/pages/PetsPage").then((module) => ({
    default: module.PetsPage,
  }))
);
const OwnersPage = lazy(() => import("./app/features/owners/pages/OwnersPage"));

type Page = "home" | "pets" | "owners";

function App() {
  const [activePage, setActivePage] =
    useState<Page>("home");

  if (activePage === "pets") {
    return (
      <Suspense fallback={<p>Cargando mascotas...</p>}>
        <PetsPage onGoHome={() => setActivePage("home")} />
      </Suspense>
    );
  }

  if (activePage === "owners") {
    return (
      <Suspense fallback={<p>Cargando propietarios...</p>}>
        <OwnersPage onGoHome={() => setActivePage("home")} />
      </Suspense>
    );
  }

  return (
    <HomePage
      onOpenPets={() => setActivePage("pets")}
      onOpenOwners={() => setActivePage("owners")}
    />
  );
}

export default App;