import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ApiClient, Rates } from 'src/api';
import { Currency } from 'src/shared/types';
import { getInputFormatDate } from 'src/utils';
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

    reaction(
      () => this.currentRow.date.data,
      (data) => {
        if (data.isValid) {
          void this.updateRate();
        }
      }
    );

    reaction(
      () => [this.currentRow.amount.data, this.currentRow.rate.data],
      ([amount, rate]) => {
        if (amount.isValid && rate.isValid) {
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
      const result = Number(this.currentRow.amount.value) * rate;
      this.currentRow.result.setValue(String(result));
    });
  };

  get isStatementExist() {
    return this.statement.length > 0;
  }

  private updateRate = async () => {
    const convertedDate = getInputFormatDate(this.currentRow.date.value);
    const result = await this.apiClient.fetchCurrencyRate(convertedDate);

    if (!result.ok) {
      console.log('Something went wrong');
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
    this.currentRow = new Row(this.counter.next(), values);
  };

  saveRow = () => {
    this.currentRow.close();
    this._rows = [this.currentRow, ...this._rows];
    const result = this.currentRow.result.value;
    this.addNewRow();
    return result;
  };

  get rows() {
    return [this.currentRow, ...this._rows];
  }

  get values() {
    return this.rows.map(({ amount, date, memo, payee }) => [date, payee, memo, amount].map((cell) => cell.value));
  }

  setTargetCurrency = (currency: Currency) => {
    this.targetCurrency = currency;
  };

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
  };

  setActiveInput = (symbol: symbol) => {
    this.currentRow.setActiveInput(symbol);
  };

  get isActive() {
    return this.currentRow.isActive;
  }

  get isRowReady() {
    return this.currentRow.isRowReady;
  }

  switchActiveInput = () => {
    this.currentRow.switchActiveInput();
  };

  sort = () => {
    console.log('sort');
    console.log(JSON.stringify(this._rows, null, 2));
  };

  reset = () => {
    this._rows = [];
    this.storage.clear();
    this.statement = [];
    this.counter.reset();
    this.currentRow = new Row(this.counter.next());
  };

  save = () => {
    const statements = [this.currentRow, ...this._rows].map((row) => row.values);
    this.storage.set(statements);
    this.statement = statements;
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
    const statements = this.storage.get();
    this.statement = statements;
  };

  exportCSV = () => {
    const rows = this.values.map((row) => {
      return Object.values(row)
        .map((value) => value)
        .join(',');
    });

    const fileContent = rows.join('\n');

    return new Blob([fileContent], { type: 'text/plain' });
  };

  removeRow = (id: string) => {
    this._rows = this._rows.filter((row) => row.id !== id);
  };
}

export const store = new Store();
