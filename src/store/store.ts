import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ApiClient, Rates } from 'src/api';
import { Currency } from 'src/shared/types';
import { getInputFormatDate } from 'src/utils';

import { Row } from './row';

export class Store {
  _rows: Row[] = [];
  private currentRow: Row;
  targetCurrency: Currency = 'USD';
  baseCurrency: Currency = 'RUB';
  private rates: Rates = {};

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

  private updateCurrentRate = () => {
    const rate = this.rates[this.targetCurrency] ?? 0;

    if (!this.currentRow.date.isValid) return;

    runInAction(() => {
      this.currentRow.rate.setValue(rate);
      const result = Number(this.currentRow.amount.value) * rate;
      this.currentRow.result.setValue(String(result));
    });
  };

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
    this.currentRow = new Row(this.getId());
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

  get isCurrentRowValid() {
    return this.currentRow.isValid;
  }

  switchActiveInput = () => {
    this.currentRow.switchActiveInput();
  };
}

export const store = new Store();
