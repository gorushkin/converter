export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  NZD = 'NZD',
  TRY = 'TRY',
  RUB = 'RUB',
  GEL = 'GEL',
}

export const currencies: Currency[] = [
  Currency.USD,
  Currency.EUR,
  Currency.NZD,
  Currency.TRY,
  Currency.RUB,
  Currency.GEL,
];

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
  payee: string;
  amount: number;
};

export enum Bank {
  BOG = 'BOG',
  TBC = 'TBC',
  VAKIF = 'VAKIF',
}

const bankNameMap = {
  [Bank.BOG]: 'BOG',
  [Bank.TBC]: 'TBC',
  [Bank.VAKIF]: 'Vakif',
};

export const getBankName = (bank: Bank): string => {
  return bankNameMap[bank];
};

export type Balance = {
  startBalance: number;
  endBalance: number;
};
