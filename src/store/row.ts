import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ApiClient } from 'src/api';
import { Currency } from 'src/shared/types';
import { getInputFormatDate } from 'src/utils';

import { Cell } from './cell';
import { validators } from './validators';

type RowValues = {
  amount: string;
  date: string;
  id: string;
  isValid: boolean;
  rate: string;
};

export class Row {
  isValid = false;
  id: string;
  amount = new Cell(0, validators.number);
  date = new Cell('', validators.date);
  rate = new Cell(0, validators.number);
  result = new Cell(0);
  targetCurrency: Currency = 'NZD';
  mode: 'edit' | 'view' = 'edit';

  private apiClient = new ApiClient();

  constructor(id: string) {
    this.isValid = false;
    this.id = id;

    makeAutoObservable(this);

    reaction(
      () => [this.date.data],
      ([data]) => {
        if (data.isValid) {
          this.isValid = true;
          void this.updateRate();
        }
      }
    );

    reaction(
      () => [this.amount.data, this.rate.data],
      ([amount, rate]) => {
        if (amount.isValid && rate.isValid) {
          const result = Number(this.amount.value) * Number(this.rate.value);
          this.result.setValue(String(result));
        }
      }
    );

    reaction(
      () => this.rate.data,
      (rate) => {
        console.log(rate);
      }
    );
  }

  reset = () => {
    this.amount.reset();
    this.date.reset();
    this.rate.reset();
    this.result.reset();
  };

  get row(): RowValues {
    return {
      amount: this.amount.value,
      date: this.date.value,
      id: this.id,
      isValid: this.isValid,
      rate: this.rate.value,
    };
  }

  updateRate = async () => {
    const convertedDate = getInputFormatDate(this.date.value);
    const result = await this.apiClient.fetchCurrencyRate(convertedDate);

    if (!result.ok) {
      console.log('Something went wrong');
      return;
    }

    const rate = result.data.rates[this.targetCurrency] ?? 0;

    runInAction(() => {
      this.rate.setValue(rate);
      const result = Number(this.amount.value) * rate;
      this.result.setValue(result);
    });
  };

  close = () => {
    this.mode = 'view';
  };

  edit = () => {
    this.mode = 'edit';
  };
}
