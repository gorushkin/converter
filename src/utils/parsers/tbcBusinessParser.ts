import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Currency, ImportTransactionDTO } from 'src/shared/types';
import { convertTbcBusinessToBaseDate } from 'src/utils/formatters';

import { CSVParser } from './parser';
import type { TBCBusinessTransactionDTO } from './types';
import { getAmount, parseVCS } from './utils';

export class TbcBusinessParser extends CSVParser<TBCBusinessTransactionDTO, TBCBusinessTransactionDTO> {
  protected parseData(data: string): TBCBusinessTransactionDTO[] {
    const parsedData = parseVCS<TBCBusinessTransactionDTO>(data, { endLine: '\r\n', header: 1, start: 2 });

    this.updateBalance(parsedData);
    return parsedData;
  }

  prepareData = (data: TBCBusinessTransactionDTO[]): ImportTransactionDTO[] => {
    const results = data.map((item) => {
      const amount = getAmount(item['Paid Out'], item['Paid In']);
      const date = convertTbcBusinessToBaseDate(item.Date);

      const memo = `${item.Description} ${item['Additional Information']}`;
      const payee = item["Partner's Name"];

      return { amount, date, memo, payee };
    });

    return results;
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

  protected updateBalance = (rows: TBCBusinessTransactionDTO[]): void => {
    if (!rows.length) {
      return;
    }

    const firstRow = rows[0];
    const lastRow = rows.at(-1);

    const amount = getAmount(firstRow['Paid Out'], firstRow['Paid In']);

    const startBalance = Number(firstRow.Balance) - amount;
    const endBalance = Number(lastRow?.Balance);

    this.balance = {
      endBalance,
      startBalance,
    };
  };
}
