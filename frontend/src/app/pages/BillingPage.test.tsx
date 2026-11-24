import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BillingPage from "./BillingPage";
import { useBillings } from "../hooks/useBillings";

vi.mock("../hooks/useBillings", () => ({
  useBillings: vi.fn(),
}));

describe("BillingPage", () => {
  beforeEach(() => {
    vi.mocked(useBillings).mockReturnValue({
      billings: [
        {
          billingId: 12,
          visitId: 7,
          billingStatus: "IN_PROGRESS",
          visitDate: "2026-11-25T10:00:00.000Z",
          petName: "Minnie Mouse",
          ownerName: "Tatjana Klatyik",
          reason: "Annual check",
        },
      ],
      loading: false,
      error: "",
      reloadBillings: vi.fn(),
    });
  });

  it("shows all billing records and their statuses", () => {
    render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("table", { name: "Billings" })).toBeInTheDocument();
    expect(screen.getByText("Minnie Mouse")).toBeInTheDocument();
    expect(screen.getByText("IN_PROGRESS")).toBeInTheDocument();
  });
});
