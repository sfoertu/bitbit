export interface QuoteResponseDto {
  amount_fiat: number;
  amount_usdc: number;
  exchange_rate: number;
  fee_breakdown: {
    card_fee: number;
    gas_fee: number;
    platform_fee: number;
    total_fee: number;
    net_amount: number;
  };
  expires_at: string;
}
