import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ApiClient } from 'src/api';
import { Row, type RowDTO } from 'src/entities/row';
import { columns, Currency, type Balance } from 'src/shared/types';
import { getId } from 'src/utils/getId';
import { ModeManager } from 'src/utils/ModeManager';

import type { RateUpdater, StatementDTO } from './types';

const modeManager = new ModeManager();

const NEW_ROW_ID = 'new-row';

export class Statement {
  rows: Row[] = [];
  currentRow: Row | null = null;
  baseCurrency: Currency = Currency.USD;
  targetCurrency: Currency = Currency.RUB;
  private apiClient = new ApiClient();
  name = '';
  id = '';
  date = '';
  startBalance = 0;
  endBalance = 0;
  inflow = 0;
  outflow = 0;
  mode = modeManager;

  constructor(statement?: StatementDTO) {
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
    if (!this.currentRow) {
      return false;
    }

    return this.currentRow.isValid;
  }

  addRow = () => {
    const newRow = new Row(this.rateUpdater, { id: NEW_ROW_ID });
    this.mode.setEditMode(newRow.id);

    runInAction(() => {
      this.currentRow = newRow;
    });
  };

  getRowPosition = (date: string) => {
    for (let i = 0; i < this.rows.length; i++) {
      const item = this.rows[i];
      if (date >= item.date.value) {
        return i;
      }
    }

    return this.rows.length;
  };

  insertNewRow = (row: Row) => {
    const position = this.getRowPosition(row.date.value);

    const rowsWithoutNew = this.rows;

    const left = rowsWithoutNew.slice(0, position);
    const right = rowsWithoutNew.slice(position);

    this.rows = [...left, row, ...right];
  };

  saveRow = () => {
    if (!this.currentRow) {
      return;
    }

    const newRow = new Row(this.rateUpdater, this.currentRow.values);

    if (this.currentRow.id === NEW_ROW_ID) {
      newRow.id = getId();
    }

    runInAction(() => {
      if (this.currentRow?.id === NEW_ROW_ID) {
        this.insertNewRow(newRow);
      } else {
        this.rows = this.rows.map((row) => (row.id === newRow.id ? newRow : row));
      }
      this.mode.setViewMode();
      this.currentRow = null;
    });
  };

  get isSaved() {
    return !!this.id;
  }

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
    if (this.currentRow) {
      return [this.currentRow, ...this.rows];
    }
    return this.rows;
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
    this.currentRow = null;
    this.name = '';
  };

  getCSV = () => {
    const headers = columns;

    const getValues = (rows: Row[]) => {
      return rows.map(({ amountInBaseCurrency, date, exchangeRate: rate, inflow, memo, outflow, payee }) => {
        const amount = Math.abs(Number(amountInBaseCurrency.value));
        const updatedMemo = `${amount} ${this.baseCurrency} (rate: ${rate.value}) ${memo.value}`;

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
    this.currentRow = null;
    this.rows = this.rows.filter((row) => row.id !== id);
  };

  updateName = (name: string) => {
    this.name = name;
  };

  get balance(): Balance {
    return { endBalance: this.endBalance, startBalance: this.startBalance };
  }

  getRowById = (id: string) => {
    return this.rows.find((row) => row.id === id);
  };

  updateRowRate = async (id: string) => {
    const row = this.getRowById(id);

    if (!row) {
      return;
    }

    throw new Error('Not implemented');
    // const rate = await this.rateUpdater(this.currentRow.date.value);

    // if (!rate) return;

    // runInAction(() => {
    //   row.exchangeRate.setValue(rate);
    // });
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

  setCurrentRow = (id: string) => {
    const row = this.getRowById(id);

    if (!row) {
      return;
    }

    this.currentRow = new Row(this.rateUpdater, row.values);
    this.currentRow.open();
    this.mode.setEditMode(row.id);
  };
}
