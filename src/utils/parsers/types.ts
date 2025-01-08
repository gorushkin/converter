import type { Currency, ImportTransactionDTO } from 'src/shared/types';

export type VakifTransactionDTO = {
  'ACCOUNT NUMBER': string;
  'RECEIPT NUMBER': number;
  'TRANSACTION DATE': string;
  'PROCESS DATE': string;
  'CARD NUMBER': string;
  'TRANSACTION  NAME': string;
  AMOUNT: number;
  BALANCE: number;
  CHANNEL: string;
  REFNO: string;
  'TRANSACTION ID': string;
  'IDENTIFICATION NUMBER': string;
  'TAX NUMBER': string;
  'D/C': string;
  NARRATIVE: string;
};

export type BOGTransactionDTO = {
  Date: string;
  Details: string;
  GEL: Currency.GEL;
  USD: Currency.USD;
  EUR: Currency.EUR;
};

export type BogDetailsDTO = {
  'Account Statement': string;
  '': string;
  _1: string;
  _2: string;
  _3: string;
  _4: string;
  _5: string;
};

export type BogResult = {
  [Currency.USD]: ImportTransactionDTO[];
  [Currency.GEL]: ImportTransactionDTO[];
};

export type BOGBusinessTransactionDTO = {
  Date: string;
  'Doc N': string;
  'Loro Account': string;
  ' Credit'?: string;
  Debit?: string;
  Rate: string;
  'Credit Amount in Gel': number;
  'Entry Comment': string;
  'Operation Type': string;
  'Operation ID': number;
  Ref: number;
  'Sender Name': string;
  'Sender Account N': string;
  'Sender Bank Code': string;
  ' Recipient Name': string;
  'Recipient Number Taxpayer': string;
  'Recipient Account N': string;
  'Recipient Bank Code': string;
  'Recipient Bank Name': string;
  Nomination: string;
  ' Additional Info': string;
  Amount: number;
  'Amount in Gel': number;
  'Turnover Credit': number;
  'Turnover Credit in Gel': number;
  'Balance at end of day': number;
  'Balance at end of day in Gel': number;
  Balance: string;
};

export type TBCBusinessTransactionDTO = {
  Date: string;
  Description: string;
  'Additional Information': string;
  'Paid Out': string;
  'Paid In': string;
  Balance: string;
  Type: string;
  'Document Date': string;
  'Document Number': string;
  "Partner's Account": string;
  "Partner's Name": string;
  "Partner's Tax Code": string;
  "Partner's Bank Code": string;
  "Partner's Bank": string;
  'Intermediary Bank Code': string;
  'Intermediary Bank': string;
  'Charge Details': string;
  'Taxpayer Code': string;
  'Taxpayer Name': string;
  'Treasury Code': string;
  'Op. Code': string;
  'Additional Description': string;
  'Transaction ID': string;
  undefined: string;
};

export type BOGBusinessDetails = [
  {
    __EMPTY: string;
    __EMPTY_1: number;
  },
  {
    __EMPTY: string;
    __EMPTY_1: number;
  },
];
