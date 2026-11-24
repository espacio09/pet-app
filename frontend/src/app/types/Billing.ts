export const BILLING_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export type BillingStatus = (typeof BILLING_STATUSES)[number];

export interface BillingListItem {
  billingId: number;
  visitId: number;
  billingStatus: BillingStatus;
  visitDate: string;
  petName: string | null;
  ownerName: string | null;
  reason: string;
}
