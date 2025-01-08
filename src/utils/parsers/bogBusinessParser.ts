import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Currency, ImportTransactionDTO } from 'src/shared/types';
import { convertBogBusinessToBaseDate } from 'src/utils/formatters';
import * as XLSX from 'xlsx';

import { XLSXParser } from './parser';
import type { BOGBusinessDetails, BOGBusinessTransactionDTO, BogDetailsDTO } from './types';
import { getAmount } from './utils';

export class BogBusinessParser extends XLSXParser<BOGBusinessTransactionDTO, BogDetailsDTO> {
  rawData: ArrayBuffer | null = null;
  workbook: XLSX.WorkBook | null = null;
  private transactionSheetName = 'Statement of Account';

  private startBalanceRowIndex = 5;
  private endBalanceRowIndex = 7;
  private headerRowIndex = 14;

  protected findData = (workbook: XLSX.WorkBook | null): BOGBusinessTransactionDTO[] => {
    if (!workbook) {
      throw new Error('Workbook is not defined');
    }

    const sheet = workbook.Sheets[this.transactionSheetName];

    const jsonData: BOGBusinessTransactionDTO[] = XLSX.utils.sheet_to_json(sheet, {
      header: this.headerRowIndex,
      range: this.headerRowIndex,
      raw: false,
    });

    this.updateBalance(sheet);

    return jsonData;
  };

  prepareData = (data: BOGBusinessTransactionDTO[]): ImportTransactionDTO[] => {
    return data.map((item) => {
      const amount = getAmount(item[' Credit'], item.Debit);
      const date = convertBogBusinessToBaseDate(item.Date);

      const memo = item['Entry Comment'];
      const payee = '';

      return {
        amount,
        date,
        memo,
        payee,
      };
    });
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

  protected updateBalance = (sheet: XLSX.WorkSheet): void => {
    const details: BOGBusinessDetails = XLSX.utils
      .sheet_to_json(sheet)
      .slice(this.startBalanceRowIndex, this.endBalanceRowIndex) as BOGBusinessDetails;

    const startBalance = Number(details[0].__EMPTY_1);

    const endBalance = Number(details[1].__EMPTY_1);

    this.balance = {
      endBalance,
      startBalance,
    };
  };
}
