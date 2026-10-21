import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./app/features/home/HomePage";

const PetsPage = lazy(() =>
  import("./app/pages/PetsPage").then((module) => ({
    default: module.PetsPage,
  }))
);
const OwnersPage = lazy(() => import("./app/features/owners/pages/OwnersPage"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/pets"
        element={
          <Suspense fallback={<p>Cargando mascotas...</p>}>
            <PetsPage />
          </Suspense>
        }
      />
      <Route
        path="/owners"
        element={
          <Suspense fallback={<p>Cargando propietarios...</p>}>
            <OwnersPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;