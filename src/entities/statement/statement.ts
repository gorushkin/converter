import { makeAutoObservable, runInAction } from 'mobx';
import { ApiClient } from 'src/api';
import { Row, type RowDTO } from 'src/entities/row';
import { columns, Currency, type Balance } from 'src/shared/types';
import { getId } from 'src/utils/getId';

import type { RateUpdater, StatementDTO } from './types';

export class Statement {
  rows: Row[] = [];
  currentRow: Row;
  targetCurrency: Currency = 'USD';
  baseCurrency: Currency = 'RUB';
  private apiClient = new ApiClient();
  name = '';
  id = '';
  date = '';
  startBalance = 0;
  endBalance = 0;
  inflow = 0;
  outflow = 0;

  constructor(statement?: StatementDTO) {
    this.currentRow = new Row(this.rateUpdater);

    this.load(statement);

    makeAutoObservable(this);
  }

  private rateUpdater: RateUpdater = async (date) => {
    const result = await this.apiClient.fetchCurrencyRate(date);

    if (!result.ok) {
      console.error('Something went wrong');
      return null;
    }

    const rates = result.data.rates;

    return rates[this.targetCurrency] ?? 0;
  };

  load = (statement?: StatementDTO) => {
    if (!statement) return;

    runInAction(() => {
      this.id = statement.id;
      this.name = statement.name;
      this.date = statement.date;
      this.targetCurrency = statement.targetCurrency;
      this.baseCurrency = statement.baseCurrency;
      this.startBalance = statement.startBalance;
      this.endBalance = statement.endBalance;
      this.inflow = statement.inflow;
      this.outflow = statement.outflow;
      this.rows = statement.row.map((row) => new Row(this.rateUpdater, row));
    });
  };

  get isCurrentRowValid() {
    return this.currentRow.isValid;
  }

  private addNewRow = () => {
    const values = this.currentRow.values;
    this.currentRow = new Row(this.rateUpdater, { date: values.date, exchangeRate: values.exchangeRate });
  };

  get isSaved() {
    return !!this.id;
  }

  updateRow = (id: string, values: Partial<RowDTO>) => {
    const row = this.rows.find((row) => row.id === id);

    if (!row) {
      console.error('Row not found');
      return;
    }

    runInAction(() => {
      row.setValues(values);
      row.close();
    });
  };

  createRow = () => {
    if (!this.currentRow.isValid) {
      console.error('Row is not valid');
      return;
    }

    this.currentRow.id = getId();
    this.rows = [this.currentRow, ...this.rows];
    const result = this.currentRow.amountInTargetCurrency.value;
    this.addNewRow();
    return result;
  };

  get statement(): StatementDTO {
    return {
      baseCurrency: this.baseCurrency,
      date: this.date,
      endBalance: this.endBalance,
      id: this.id,
      inflow: this.inflow,
      name: this.name,
      outflow: this.outflow,
      row: this.rows.map((row) => row.values),
      startBalance: this.startBalance,
      targetCurrency: this.targetCurrency,
    };
  }

  get data() {
    return [this.currentRow, ...this.rows];
  }

  setTargetCurrency = (currency: Currency) => {
    this.targetCurrency = currency;
  };

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
  };

  sort = () => {
    throw new Error('Not implemented');
  };

  reset = () => {
    this.rows = [];
    this.currentRow = new Row(this.rateUpdater);
    this.name = '';
  };

  getCSV = () => {
    const headers = columns;

    const getValues = (rows: Row[]) => {
      return rows.map(({ amountInBaseCurrency, date, exchangeRate: rate, inflow, memo, outflow, payee }) => {
        const amount = Math.abs(Number(amountInBaseCurrency.value));
        const updatedMemo = `(${amount} ${this.targetCurrency} * ${rate.value}) ${memo.value}`;

        const updatedInflow = (Number(inflow.value) * Number(rate.value)).toFixed(2);
        const updatedOutflow = (Number(outflow.value) * Number(rate.value)).toFixed(2);

        return [date.value, payee.value, updatedMemo, updatedOutflow, updatedInflow];
      });
    };

    const header = headers.map((item) => `"${item}"`).join(',');

    const values = getValues(this.rows);

    const rows = values.map((row) => {
      return Object.values(row)
        .map((value) => `"${value}"`)
        .join(',');
    });

    const fileContent = header + '\n' + rows.join('\n');

    return new Blob([fileContent], { type: 'text/plain' });
  };

  removeRow = (id: string) => {
    if (id === this.currentRow.id) {
      this.currentRow.reset();
    } else {
      this.rows = this.rows.filter((row) => row.id !== id);
    }
  };

  updateName = (name: string) => {
    this.name = name;
  };

  get balance(): Balance {
    return { endBalance: this.endBalance, startBalance: this.startBalance };
  }
}
