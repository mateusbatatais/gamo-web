// types/donation.ts
export interface CreateDonationRequest {
  amount: number;
  currency: string;
  email?: string;
}

export interface CreateDonationResponse {
  clientSecret: string;
  amount: number;
}
