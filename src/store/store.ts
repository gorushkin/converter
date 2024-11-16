import { makeAutoObservable, reaction, runInAction, autorun } from 'mobx';
import { ApiClient, Rates } from 'src/api';
import { Currency } from 'src/shared/types';
import { counter } from 'src/utils/counter';
import { statementStorage } from 'src/utils/storage';

import { Row, RowValues } from './row';

export class Store {
  _rows: Row[] = [];
  private currentRow: Row;
  targetCurrency: Currency = 'USD';
  baseCurrency: Currency = 'RUB';
  private rates: Rates = {};
  private counter = counter();
  private apiClient = new ApiClient();
  statement: RowValues[] = [];
  storage = statementStorage;

  constructor() {
    this.currentRow = new Row(this.counter.next());

    makeAutoObservable(this);

    autorun(() => {
      if (!this.currentRow.date.isValid) return;

      void this.updateRate();
    });

    reaction(
      () => [this.currentRow.amount.data, this.currentRow.rate.data] as const,
      ([amount, rate]) => {
        if (rate.isValid) {
          const result = Number(amount.value) * Number(rate.value);
          this.currentRow.result.setValue(String(result));
        }
      }
    );

    reaction(
      () => this.targetCurrency,
      () => {
        this.updateCurrentRate();
      }
    );
  }

  private updateCurrentRate = () => {
    const rate = this.rates[this.targetCurrency] ?? 0;

    if (!this.currentRow.date.isValid) return;

    runInAction(() => {
      this.currentRow.rate.setValue(rate);
    });
  };

  get isStatementExist() {
    return this.statement.length > 0;
  }

  get isCurrentRowValid() {
    return this.currentRow.isValid;
  }

  private updateRate = async () => {
    const result = await this.apiClient.fetchCurrencyRate(this.currentRow.date.value);

    if (!result.ok) {
      console.error('Something went wrong');
      return;
    }

    const rates = result.data.rates;

    runInAction(() => {
      this.rates = rates;
      this.updateCurrentRate();
    });
  };

  private addNewRow = () => {
    const values = this.currentRow.values;
    this.currentRow = new Row(this.counter.next(), { date: values.date, rate: values.rate });
  };

  saveRow = () => {
    if (!this.currentRow.isValid) {
      console.error('Row is not valid');
      return;
    }

    this.currentRow.close();
    this._rows = [this.currentRow, ...this._rows];
    const result = this.currentRow.result.value;
    this.addNewRow();
    return result;
  };

  get rows() {
    return [this.currentRow, ...this._rows];
  }

  get headers() {
    return ['Date', 'Payee', 'Memo', 'Amount'];
  }

  get values() {
    return this.rows.map(({ date, inflow, memo, outflow, payee, rate }) => {
      const updatedMemo = `[${rate.value} * ${this.targetCurrency}] ${memo.value}`;

      const amount = ((Number(inflow.value) - Number(outflow.value)) * Number(rate.value)).toFixed(2);

      return [date.value, payee.value, updatedMemo, amount];
    });
  }

  setTargetCurrency = (currency: Currency) => {
    this.targetCurrency = currency;
  };

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
  };

  sort = () => {};

  reset = () => {
    this._rows = [];
    this.storage.clear();
    this.statement = [];
    this.counter.reset();
    this.currentRow = new Row(this.counter.next());
  };

  save = () => {
    // const statements = [this.currentRow, ...this._rows].map((row) => row.values);
    // this.storage.set({ currency: this.targetCurrency, statements });
    // this.statement = statements;
  };

  importStatement = () => {
    const statements = this.statement.map((row) => new Row(row.id, row));

    const [currentRow, ...rows] = statements;

    runInAction(() => {
      this._rows = rows;
      if (currentRow) {
        this.currentRow = currentRow;
      }
    });
  };

  load = () => {
    // const { currency, statements } = this.storage.get();
    // this.statement = statements;
    // this.targetCurrency = currency;
    // this.counter.set(statements.length);
  };

  exportCSV = () => {
    const header = this.headers.map((item) => `"${item}"`).join(',');
    const rows = this.values.map((row) => {
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
      this._rows = this._rows.filter((row) => row.id !== id);
    }
  };
}

export const store = new Store();
