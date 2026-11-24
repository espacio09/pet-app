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

vi.mock("../../../types/vets", () => ({
  getVets: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../../types/pets", () => ({
  getPets: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../../types/appointments", () => ({
  getAppointments: vi.fn().mockResolvedValue([
    {
      appointmentId: 1,
      petId: 15,
      vetId: 3,
      appointmentDate: "2026-11-25T10:00:00.000Z",
      reason: "Annual vaccination",
      status: "SCHEDULED",
    },
  ]),
}));

vi.mock("../../../types/visits", () => ({
  getVisits: vi.fn().mockResolvedValue([
    { visitId: 1, visitStatus: "OPEN" },
    { visitId: 2, visitStatus: "COMPLETED" },
    { visitId: 3, visitStatus: "FOLLOW_UP_REQUIRED" },
  ]),
}));

vi.mock("../../../types/billings", () => ({
  getBillings: vi.fn().mockResolvedValue([
    { billingId: 1, billingStatus: "OPEN" },
    { billingId: 2, billingStatus: "IN_PROGRESS" },
    { billingId: 3, billingStatus: "COMPLETED" },
  ]),
}));

function CurrentPath() {
  const { pathname } = useLocation();
  return <output aria-label="Ruta actual">{pathname}</output>;
}

describe("Navegación por Dashboard", () => {
  it("navigates from the dashboard to pets and owners", async () => {
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
          <Route
            path="/appointments"
            element={
              <>
                <h1>Appointments</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route
            path="/appointments/:id"
            element={
              <>
                <h1>Appointments</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route
            path="/visits"
            element={
              <>
                <h1>Visits</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route
            path="/billing"
            element={
              <>
                <h1>Billing</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route
            path="/follow-ups"
            element={
              <>
                <h1>Follow-Ups</h1>
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

    await screen.findByRole("link", { name: /1 appointments/i });
    fireEvent.click(screen.getByRole("link", { name: /appointments/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent(
      "/appointments",
    );
    expect(
      screen.getByRole("heading", { name: "Appointments" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /home/i }));
    fireEvent.click(screen.getByRole("link", { name: /proprietarios/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/owners");
  });

  it("shows all visits and only unfinished billings in the dashboard counts", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CurrentPath />
        <Routes>
          <Route path="/" element={<DashboardCards />} />
          <Route
            path="/visits"
            element={
              <>
                <h1>Visits</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route
            path="/billing"
            element={
              <>
                <h1>Billing</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
          <Route
            path="/follow-ups"
            element={
              <>
                <h1>Follow-Ups</h1>
                <Link to="/">Home</Link>
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const visitsLink = await screen.findByRole("link", { name: /3 visits/i });
    await screen.findByRole("link", { name: /2 billing/i });

    fireEvent.click(visitsLink);
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/visits");
    fireEvent.click(screen.getByRole("link", { name: /home/i }));
    fireEvent.click(await screen.findByRole("link", { name: /2 billing/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/billing");
    fireEvent.click(screen.getByRole("link", { name: /home/i }));
    fireEvent.click(
      await screen.findByRole("link", { name: /1 follow-ups/i }),
    );
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent(
      "/follow-ups",
    );
  });

  it("navigates from the dashboard to veterinarians", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CurrentPath />
        <Routes>
          <Route path="/" element={<DashboardCards />} />
          <Route path="/vets" element={<h1>Veterinarios</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link", { name: /veterinários/i }));
    expect(screen.getByLabelText("Ruta actual")).toHaveTextContent("/vets");
    expect(screen.getByRole("heading", { name: "Veterinarios" })).toBeInTheDocument();
  });
});
