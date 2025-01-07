import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Bank, getBankName, ImportTransactionDTO } from 'src/shared/types';
import { convertVakifToBaseDate, getISODate } from 'src/utils/formatters';
import * as XLSX from 'xlsx';

import { XLSXParser } from './parser';
import type { VakifTransactionDTO } from './types';

export class VakifParser extends XLSXParser<VakifTransactionDTO, VakifTransactionDTO> {
  bank: Bank = Bank.VAKIF;
  private transactionSheetName = 'Sheet1';
  private headerRowIndex = 6;
  private transactionLastRowIndex = 4;

  protected findData = (workbook: XLSX.WorkBook | null): VakifTransactionDTO[] => {
    if (!workbook) {
      throw new Error('Workbook is not defined');
    }

    const sheet = workbook.Sheets[this.transactionSheetName];

    const jsonData = XLSX.utils
      .sheet_to_json(sheet, {
        header: this.headerRowIndex,
        range: this.headerRowIndex,
      })
      .slice(0, -this.transactionLastRowIndex) as VakifTransactionDTO[];

    this.updateBalance(jsonData);

    return jsonData;
  };

  protected updateBalance = (rows: VakifTransactionDTO[]): void => {
    if (!rows.length) {
      return;
    }

    const startBalance = rows[0].BALANCE - rows[0].AMOUNT;
    const endBalance = rows[rows.length - 1].BALANCE;

    this.balance = {
      endBalance,
      startBalance,
    };
  };

  protected convertData = (data: ImportTransactionDTO[]): StatementDTO | null => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let runningBalance = this.balance.startBalance;

    const rows: RowDTO[] = data.map((item, id) => {
      const inflow = item.amount > 0 ? String(item.amount) : '';
      const outflow = item.amount < 0 ? String(Math.abs(item.amount)) : '';
      runningBalance = runningBalance + Number(item.amount);

      totalInflow += Number(inflow);
      totalOutflow += Number(outflow);

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

    const name = `${getBankName(this.bank)} ${getISODate()}`;

    return {
      baseCurrency: this.baseCurrency,
      date: new Date().toISOString(),
      id: '',
      inflow: totalInflow,
      name,
      outflow: totalOutflow,
      row: rows,
      targetCurrency: this.targetCurrency,
      ...this.balance,
    };
  };

  protected prepareData = (data: VakifTransactionDTO[]): ImportTransactionDTO[] => {
    const updatedData: ImportTransactionDTO[] = data.map((item) => {
      return {
        amount: item.AMOUNT ?? 0,
        date: convertVakifToBaseDate(item['TRANSACTION DATE'] ?? ''),
        memo: item.NARRATIVE ?? '',
        payee: '',
      };
    });

    return updatedData;
  };
}
