import type { Currency } from 'src/shared/types';

export type StatementDTO = {
  inflow: string;
  outflow: string;
  rate: string;
  memo: string;
  payee: string;
  date: string;
  id: string;
  amountInBaseCurrency: string;
  amountInTargetCurrency: string;
  baseCurrency: Currency;
  targetCurrency: Currency;
};
