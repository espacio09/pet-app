import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePets } from "./usePets";
import { getPets } from "../types/pets";

vi.mock("../types/pets", () => ({
  getPets: vi.fn(),
}));

describe("usePets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps owner_id from API to ownerId in the frontend model", async () => {
    vi.mocked(getPets).mockResolvedValue([
      {
        pet_id: 1,
        pet_name: "Nala",
        sex: "female",
        weight: 12,
        birthdate: "2021-02-03",
        owner_id: 7,
        ownerFirstName: "Ana",
        ownerLastName: "García",
        color: "white",
        microchip_no: 123456,
        breed_id: 2,
        pet_typeId: 1,
      },
    ]);

    const { result } = renderHook(() => usePets());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pets).toHaveLength(1);
    expect(result.current.pets[0].ownerId).toBe(7);
  });
});
