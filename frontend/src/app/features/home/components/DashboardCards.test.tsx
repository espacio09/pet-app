import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Link,
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import DashboardCards from "./DashboardCards";

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
          <Route path="/owners" element={<h1>Owners</h1>} />
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
