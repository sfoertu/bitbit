export interface ExecuteRequestDto {
  idempotency_key: string;
  amount_fiat: number;
  currency: string;
  provider_type: string;
  card_token: string;
  reservation_hash: string;
}
