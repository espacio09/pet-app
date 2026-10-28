import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import DashboardCards from "./DashboardCards";

vi.mock("../../../types/owners", () => ({
  getOwners: vi.fn().mockResolvedValue([]),
}));

function CurrentPath() {
  const { pathname } = useLocation();
  return <output aria-label="Ruta actual">{pathname}</output>;
}

describe("Navegación por Dashboard", () => {
  it("navigates from the dashboard to pets and owners", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CurrentPath />
        <Routes>
          <Route path="/" element={<DashboardCards />} />
          <Route
            path="/pets"
            element={
              <>
                <h1>Pets</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route path="/appointments" element={<h1>Appointments</h1>} />
          <Route
            path="/appointments/:id"
            element={
              <>
                <h1>Appointments</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route path="/follow-up" element={<h1>Follow-up</h1>} />
          <Route
            path="/follow-up/:id"
            element={
              <>
                <h1>Follow-up</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: /patients/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/pets");

    fireEvent.click(screen.getByRole("link", { name: /home/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/");

    fireEvent.click(screen.getByRole("link", { name: /proprietarios/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/owners");
  });
});
