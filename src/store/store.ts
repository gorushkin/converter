import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ApiClient, Rates } from 'src/api';
import { Currency } from 'src/shared/types';
import { getInputFormatDate } from 'src/utils';

import { Row } from './row';

export class Store {
  _rows: Row[] = [];
  currentRow: Row;
  activeInput: 'date' | 'amount' = 'date';
  targetCurrency: Currency = 'USD';
  baseCurrency: Currency = 'RUB';
  rates: Rates = {};

  private counter = (): (() => string) => {
    let i = 0;

    return (): string => {
      i += 1;
      return i.toString();
    };
  };

  private getId = this.counter();
  private apiClient = new ApiClient();

  constructor() {
    this.currentRow = new Row(this.getId());
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

  updateCurrentRate = () => {
    const rate = this.rates[this.targetCurrency] ?? 0;

    runInAction(() => {
      this.currentRow.rate.setValue(rate);
      const result = Number(this.currentRow.amount.value) * rate;
      this.currentRow.result.setValue(String(result));
    });
  };

  updateRate = async () => {
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
    this.currentRow = new Row(this.getId());
  };

  saveRow = () => {
    const isCurrentRowValid = this.currentRow.isValid;

    if (!isCurrentRowValid) {
      return;
    }

    this.currentRow.close();
    this._rows = [this.currentRow, ...this._rows];
    this.addNewRow();
  };

  get rows() {
    return [this.currentRow, ...this._rows];
  }

  setTargetCurrency = (currency: Currency) => {
    this.targetCurrency = currency;
  };

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
  };
}

export const store = new Store();
