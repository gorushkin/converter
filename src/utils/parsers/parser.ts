import type { StatementDTO } from 'src/entities/statement';
import type { Balance, Bank, Currency, ImportTransactionDTO } from 'src/shared/types';
import * as XLSX from 'xlsx';

export abstract class Parser<T, K> {
  protected bank: Bank;
  protected baseCurrency: Currency;
  protected targetCurrency: Currency;

  protected rowData: XLSX.WorkBook | null = null;

  protected balance: Balance = {
    endBalance: 0,
    startBalance: 0,
  };

  constructor(bank: Bank, baseCurrency: Currency, targetCurrency: Currency) {
    this.bank = bank;
    this.baseCurrency = baseCurrency;
    this.targetCurrency = targetCurrency;
  }

  getData = (buffer: ArrayBuffer): null | StatementDTO => {
    const workbook = this.parseData(buffer);

    const clearData = this.findData(workbook);

    const convertedData = this.prepareData(clearData);

    return this.convertData(convertedData);
  };

  private parseData = (buffer: ArrayBuffer) => {
    const data = new Uint8Array(buffer);
    return XLSX.read(data, { type: 'array' });
  };

  protected abstract updateBalance(rows: K[]): void;
  protected abstract findData(workbook: XLSX.WorkBook | null): T[];
  protected abstract prepareData(data: T[]): ImportTransactionDTO[];
  protected abstract convertData(data: ImportTransactionDTO[]): StatementDTO | null;
}
