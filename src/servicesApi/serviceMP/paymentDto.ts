
export interface PaymentDto {
  id: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  payerEmail: string;
  createdAt: string;
}
