import type { BillingListItem } from "./Billing";
import { getUserFacingHttpErrorMessage } from "../shared/utils/user-facing-error";

const API_URL = "http://localhost:3002";

export async function getBillings(): Promise<BillingListItem[]> {
  const response = await fetch(`${API_URL}/billings`);
  if (!response.ok) {
    throw new Error(
      await getUserFacingHttpErrorMessage(
        response,
        "No se pudieron cargar los billings.",
      ),
    );
  }
  return response.json();
}
