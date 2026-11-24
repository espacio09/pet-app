import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FollowUpsPage from "./FollowUpsPage";
import { useVisits } from "../hooks/useVisits";

vi.mock("../hooks/useVisits", () => ({
  useVisits: vi.fn(),
}));

describe("FollowUpsPage", () => {
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
        {
          visitId: 8,
          appointmentId: 2,
          billingId: null,
          visitDate: "2026-11-26T10:00:00.000Z",
          petId: 16,
          petName: "Pluto",
          ownerName: "Mickey Mouse",
          vet: "Dr. Smith",
          reason: "Vaccination",
          diagnosis: null,
          treatment: null,
          medication: null,
          visitNotes: null,
          indication: null,
          visitStatus: "COMPLETED",
        },
      ],
      loading: false,
      error: "",
      reloadVisits: vi.fn(),
    });
  });

  it("shows only visits that require follow-up", () => {
    render(
      <MemoryRouter>
        <FollowUpsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Follow-Ups" })).toBeInTheDocument();
    expect(screen.getByText("Minnie Mouse")).toBeInTheDocument();
    expect(screen.queryByText("Pluto")).not.toBeInTheDocument();
  });
});
