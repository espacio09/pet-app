import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./app/features/home/HomePage";

const PetsPage = lazy(() =>
  import("./app/pages/PetsPage").then((module) => ({
    default: module.PetsPage,
  }))
);
const OwnersPage = lazy(() => 
  import("./app/features/owners/pages/OwnersPage"));

const VetsPage = lazy(() =>
  import("./app/features/vets/pages/VetsPage"),
);
const AppointmentsPage = lazy(() =>
  import("./app/pages/AppointmentsPage"),
);
const VisitsPage = lazy(() => import("./app/pages/VisitsPage"));
const BillingPage = lazy(() => import("./app/pages/BillingPage"));

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
      <Route
        path="/vets"
        element={
          <Suspense fallback={<p>Cargando veterinarios...</p>}>
            <VetsPage />
          </Suspense>
        }
      />
      <Route
        path="/appointments"
        element={
          <Suspense fallback={<p>Loading appointments...</p>}>
            <AppointmentsPage />
          </Suspense>
        }
      />
      <Route
        path="/visits"
        element={
          <Suspense fallback={<p>Loading visits...</p>}>
            <VisitsPage />
          </Suspense>
        }
      />
      <Route
        path="/billing"
        element={
          <Suspense fallback={<p>Loading billings...</p>}>
            <BillingPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;