import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Currency, ImportTransactionDTO } from 'src/shared/types';
import { convertBogRetailToBaseDate } from 'src/utils/formatters';
import * as XLSX from 'xlsx';

import { XLSXParser } from './parser';
import type { BOGTransactionDTO, BogDetailsDTO, BogResult } from './types';

export class BogRetailParser extends XLSXParser<BOGTransactionDTO, BogDetailsDTO> {
  rawData: ArrayBuffer | null = null;
  workbook: XLSX.WorkBook | null = null;
  private transactionSheetName = 'Transactions';
  private detailsSheetName = 'Details';

  protected findData = (workbook: XLSX.WorkBook | null) => {
    if (!workbook) {
      throw new Error('Workbook is not defined');
    }

    const sheet = workbook.Sheets[this.transactionSheetName];
    const detailsSheet = workbook.Sheets[this.detailsSheetName];
    const rowsJsonData: BOGTransactionDTO[] = XLSX.utils.sheet_to_json(sheet);
    const detailsJsonData: BogDetailsDTO[] = XLSX.utils.sheet_to_json(detailsSheet);
    const jsonDataWithoutEmptyRows = rowsJsonData.filter((item) => item.Date !== 'Balance');

    this.updateBalance(detailsJsonData);

    return jsonDataWithoutEmptyRows;
  };

  prepareData = (data: BOGTransactionDTO[]): ImportTransactionDTO[] => {
    const results: BogResult = data.reduce<BogResult>(
      (transactions, item) => {
        const currency = item.USD ? 'USD' : 'GEL';

        const amount = Number(item[currency as keyof BOGTransactionDTO]);
        const date = convertBogRetailToBaseDate(item.Date);

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
      { [Currency.GEL]: [], [Currency.USD]: [] }
    );

    if (!results[this.baseCurrency as keyof typeof results]) {
      return [];
    }

    return results[this.baseCurrency as keyof typeof results];
  };

  convertData = (data: ImportTransactionDTO[]): StatementDTO | null => {
    let runningBalance = this.balance.startBalance;

    const rows: RowDTO[] = data.map((item, id) => {
      const inflow = item.amount > 0 ? String(item.amount) : '';
      const outflow = item.amount < 0 ? String(Math.abs(item.amount)) : '';
      runningBalance = runningBalance + Number(item.amount);

      return {
        ...item,
        amountInBaseCurrency: String(item.amount),
        amountInTargetCurrency: '0',
        exchangeRate: '0',
        id: String(id),
        inflow,
        outflow,
        runningBalance: String(runningBalance),
      };
    });

    return {
      baseCurrency: this.baseCurrency,
      date: new Date().toISOString(),
      endBalance: this.balance.endBalance,
      id: '',
      inflow: 0,
      name: 'BOG',
      outflow: 0,
      row: rows,
      startBalance: this.balance.startBalance,
      targetCurrency: Currency.RUB,
    };
  };

  protected getBalance = (rows: BogDetailsDTO): number => {
    const data = Object.values(rows);

    const row = data.find((item) => item.includes(this.baseCurrency));

    return parseFloat(row ?? '');
  };

  protected updateBalance = (rows: BogDetailsDTO[]): void => {
    if (!rows.length) {
      return;
    }

    const startBalance = this.getBalance(rows[5]);
    const endBalance = this.getBalance(rows[9]);

    this.balance = {
      endBalance,
      startBalance,
    };
  };
}
