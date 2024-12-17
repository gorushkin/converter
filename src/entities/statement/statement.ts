import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ApiClient } from 'src/api';
import { Row, type RowDTO } from 'src/entities/row';
import { columns, Currency, type Balance } from 'src/shared/types';
import { getId } from 'src/utils/getId';

import type { RateUpdater, StatementDTO } from './types';

export class Statement {
  rows: Row[] = [];
  currentRow: Row;
  baseCurrency: Currency = 'USD';
  targetCurrency: Currency = 'RUB';
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

    void this.load(statement);

    makeAutoObservable(this);

    reaction(
      () => this.baseCurrency,
      () => {
        void this.updateRowsRates();
      }
    );
  }

  private rateUpdater: RateUpdater = async (date) => {
    const result = await this.apiClient.fetchCurrencyRate(date);

    if (!result.ok) {
      console.error('Something went wrong');
      return 0;
    }

    const rates = result.data.rates;

    return rates[this.baseCurrency] ?? 0;
  };

  load = async (statement?: StatementDTO): Promise<void> => {
    if (!statement) return;

    const updatedRows = await this.updateRowDTORates(statement.row);

    runInAction(() => {
      this.id = statement.id;
      this.name = statement.name;
      this.date = statement.date;
      this.baseCurrency = statement.baseCurrency;
      this.targetCurrency = statement.targetCurrency;
      this.startBalance = statement.startBalance;
      this.endBalance = statement.endBalance;
      this.inflow = statement.inflow;
      this.outflow = statement.outflow;
      this.rows = updatedRows.map((row) => new Row(this.rateUpdater, row));
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

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
  };

  setTargetCurrency = (currency: Currency) => {
    this.targetCurrency = currency;
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
        const updatedMemo = `(${amount} ${this.baseCurrency} * ${rate.value}) ${memo.value}`;

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

  updateRate = async () => {
    const rate = await this.rateUpdater(this.currentRow.date.value);

    if (!rate) return;

    runInAction(() => {
      this.currentRow.exchangeRate.setValue(rate);
    });
  };

  updateRowsRates = async () => {
    const promises = this.rows.map(async (row) => {
      const rate = await this.rateUpdater(row.date.value);

      runInAction(() => {
        row.exchangeRate.setValue(rate);
      });
    });

    await Promise.all(promises);
  };

  updateRowDTORates = async (row: RowDTO[]) => {
    const promises = row.map(async (row) => {
      const exchangeRate = Number(row.exchangeRate);

      if (exchangeRate) {
        return row;
      }

      const rate = await this.rateUpdater(row.date);

      return { ...row, exchangeRate: String(rate) };
    });

    return await Promise.all(promises);
  };
}
