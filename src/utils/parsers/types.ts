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
