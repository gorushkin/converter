import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Bank, ImportTransactionDTO } from 'src/shared/types';
import * as XLSX from 'xlsx';

import { convertBogToBaseDate } from './formatters';

type BOGTransactionDTO = {
  Date: string;
  Details: string;
  GEL: string;
  USD: string;
  EUR: string;
  GBP: string;
};

type BogResult = {
  USD: ImportTransactionDTO[];
  GEL: ImportTransactionDTO[];
};

class Parser {
  rawData: ArrayBuffer | null = null;
  workbook: XLSX.WorkBook | null = null;
  bank: Bank | null = Bank.BOG;
  private transactionSheetName = 'Transactions';

  parseData = (buffer: ArrayBuffer) => {
    const data = new Uint8Array(buffer);
    return XLSX.read(data, { type: 'array' });
  };

  getData = (buffer: ArrayBuffer): null | StatementDTO => {
    this.workbook = this.parseData(buffer);
    const convertedData = this.convertData();

    if (!convertedData) {
      return null;
    }

    return this.updateDate(convertedData);
  };

  updateDate = (data: ImportTransactionDTO[]): StatementDTO | null => {
    const rows: RowDTO[] = data.map((item, id) => {
      const inflow = item.amount > 0 ? String(item.amount) : '';
      const outflow = item.amount < 0 ? String(Math.abs(item.amount)) : '';

      return {
        ...item,
        amountInBaseCurrency: String(item.amount),
        amountInTargetCurrency: '0',
        exchangeRate: '0',
        id: String(id),
        inflow,
        outflow,
      };
    });

    return {
      baseCurrency: 'GEL',
      date: new Date().toISOString(),
      id: '',
      name: 'BOG',
      row: rows,
      targetCurrency: 'RUB',
    };
  };

  convertData = (): null | ImportTransactionDTO[] => {
    if (!this.workbook) {
      return null;
    }

    const sheet = this.workbook.Sheets[this.transactionSheetName];
    const jsonData: BOGTransactionDTO[] = XLSX.utils.sheet_to_json(sheet);

    const jsonDataWithoutEmptyRows = jsonData.filter((item) => item.Date !== 'Balance');

    const results: BogResult = jsonDataWithoutEmptyRows.reduce<BogResult>(
      (transactions, item) => {
        const currency = item.USD ? 'USD' : 'GEL';

        const amount = Number(item[currency as keyof BOGTransactionDTO]);
        const date = convertBogToBaseDate(item.Date);

        const memo = item.Details;
        const payee = '';

        const USD = transactions.USD;
        const GEL = transactions.GEL;

        const payload: ImportTransactionDTO = { amount, date, memo, payee };

        if (currency === 'USD') {
          USD.push(payload);
        }

        if (currency === 'GEL') {
          GEL.push(payload);
        }

        return transactions;
      },
      { GEL: [], USD: [] }
    );

    return results.GEL;
  };
}

export const parser = new Parser();
