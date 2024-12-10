export type Currency = 'USD' | 'EUR' | 'NZD' | 'TRY' | 'RUB' | 'GEL';

export enum Column {
  DATE = 'Date',
  INFLOW = 'Inflow',
  OUTFLOW = 'Outflow',
  PAYEE = 'Payee',
  MEMO = 'Memo',
}

export const columns = [Column.DATE, Column.PAYEE, Column.MEMO, Column.OUTFLOW, Column.INFLOW];

export type ImportTransactionDTO = {
  date: string;
  memo: string;
  // inflow: string;
  // outflow: string;
  payee: string;
  amount: number;
};

export enum Bank {
  BOG = 'bog',
  TBC = 'tbc',
  VAKIF = 'vakif',
}
