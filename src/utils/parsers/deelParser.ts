import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Currency, ImportTransactionDTO } from 'src/shared/types';
import { convertDeelToBaseDate } from 'src/utils/formatters';

import { CSVParser } from './parser';
import type { DeelTransactionDTO } from './types';
import { getAmount, parseVCS } from './utils';

export class DeelParser extends CSVParser<DeelTransactionDTO, DeelTransactionDTO> {
  protected parseData(data: string): DeelTransactionDTO[] {
    const parsedData = parseVCS<DeelTransactionDTO>(data);

    this.updateBalance(parsedData);
    return parsedData;
  }

  prepareData = (data: DeelTransactionDTO[]): ImportTransactionDTO[] => {
    const results = data.map((item) => {
      const amount = getAmount(item['Transaction Amount']);
      const date = convertDeelToBaseDate(item['Date Requested']);

      const memo = '';
      const payee = item['Withdraw Method Custom Name'];

      return { amount, date, memo, payee };
    });

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  protected updateBalance = (rows: DeelTransactionDTO[]): void => {
    if (!rows.length) {
      return;
    }

    const startBalance = 0;
    const endBalance = 0;

    this.balance = {
      endBalance,
      startBalance,
    };
  };
}
