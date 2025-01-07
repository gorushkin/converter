import type { StatementDTO } from 'src/entities/statement';
import type { Balance, Bank, Currency, ImportTransactionDTO } from 'src/shared/types';
import * as XLSX from 'xlsx';

export abstract class Parser<I, T, K> {
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

  getData = (buffer: ArrayBuffer | string): null | StatementDTO => {
    const parsedData = this.parseData(buffer);

    const convertedData = this.prepareData(parsedData);

    return this.convertData(convertedData);
  };

  protected abstract parseData(buffer: ArrayBuffer | string): T[];

  protected abstract updateBalance(rows: K[]): void;
  protected abstract findData(workbook: I | null): T[];
  protected abstract prepareData(data: T[]): ImportTransactionDTO[];
  protected abstract convertData(data: ImportTransactionDTO[]): StatementDTO | null;
}

export abstract class XLSXParser<T, K> extends Parser<XLSX.WorkBook, T, K> {
  protected parseData(buffer: ArrayBuffer): T[] {
    const data = new Uint8Array(buffer);

    const workbook = XLSX.read(data, { cellDates: true, type: 'array' });

    return this.findData(workbook);
  }
}

export abstract class CSVParser<T, K> extends Parser<string, T, K> {}
