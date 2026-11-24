import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VisitsPage from "./VisitsPage";
import { useVisits } from "../hooks/useVisits";

vi.mock("../hooks/useVisits", () => ({
  useVisits: vi.fn(),
}));

describe("VisitsPage", () => {
  beforeEach(() => {
    vi.mocked(useVisits).mockReturnValue({
      visits: [
        {
          visitId: 7,
          appointmentId: 1,
          billingId: null,
          visitDate: "2026-11-25T10:00:00.000Z",
          petId: 15,
          petName: "Minnie Mouse",
          ownerName: "Tatjana Klatyik",
          vet: "Dr. Smith",
          reason: "Annual check",
          diagnosis: null,
          treatment: null,
          medication: null,
          visitNotes: null,
          indication: null,
          visitStatus: "FOLLOW_UP_REQUIRED",
        },
      ],
      loading: false,
      error: "",
      reloadVisits: vi.fn(),
    });
  });

  it("shows visit details and the visit status", () => {
    render(
      <MemoryRouter>
        <VisitsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("table", { name: "Visits" })).toBeInTheDocument();
    expect(screen.getByText("Minnie Mouse")).toBeInTheDocument();
    expect(screen.getByText("FOLLOW_UP_REQUIRED")).toBeInTheDocument();
  });
});
