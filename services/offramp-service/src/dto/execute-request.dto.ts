export interface ExecuteRequestDto {
  idempotency_key: string;
  swap_id: number;
  seller_address: string;
  iban: string;
  amount_usdc: number;
}
