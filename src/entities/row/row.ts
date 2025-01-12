import { makeAutoObservable, reaction, runInAction } from 'mobx';
import type { RowDTO } from 'src/entities/row';
import type { RateUpdater } from 'src/entities/statement';
import { validators } from 'src/shared/utils';
import { getCurrentDate } from 'src/utils';

import { Cell } from './cell';

export class Row {
  id = '';
  inflow = new Cell(0);
  outflow = new Cell(0);
  amountInBaseCurrency = new Cell(0, validators.number);
  date = new Cell('', validators.date);
  exchangeRate = new Cell(0, validators.number);
  runningBalance = new Cell(0);
  memo = new Cell('');
  payee = new Cell('');
  amountInTargetCurrency = new Cell(0);
  mode: 'edit' | 'view' = 'view';
  isClear = false;

  updater: RateUpdater;

  constructor(updater: RateUpdater, values: Partial<RowDTO> = {}) {
    this.updater = updater;

    this.setValues(values);

    makeAutoObservable(this);

    reaction(
      () => [this.inflow.value, this.outflow.value],
      () => {
        this.amountInBaseCurrency.setValue(Number(this.inflow.value) - Number(this.outflow.value));
      }
    );

    reaction(
      () => [this.amountInBaseCurrency.data, this.exchangeRate.data] as const,
      ([amount, rate]) => {
        if (rate.isValid) {
          const result = Number(amount.value) * Number(rate.value);
          this.amountInTargetCurrency.setValue(String(result));
        } else {
          this.amountInTargetCurrency.setValue(0);
        }
      }
    );

    reaction(
      () => this.inflow.value,
      () => {
        this.outflow.setValue(0);
      }
    );

    reaction(
      () => this.outflow.value,
      () => {
        this.inflow.setValue(0);
      }
    );

    reaction(
      () => [this.date.value, this.amountInBaseCurrency.value],
      () => {
        if (!this.date.isValid) return;

        void this.updateRate();
      }
    );
  }

  setValues = (values: Partial<RowDTO> = {}) => {
    runInAction(() => {
      this.date.setValue(values.date ?? getCurrentDate());

      if (!values.date) {
        void this.updateRate();
      }
      this.inflow.setValue(values.inflow ?? 0);
      this.outflow.setValue(values.outflow ?? 0);

      const amountInTargetCurrency =
        Number(values.amountInTargetCurrency) || Number(values.amountInBaseCurrency) * Number(values.exchangeRate) || 0;

      this.amountInBaseCurrency.setValue(values.amountInBaseCurrency ?? 0);
      this.amountInTargetCurrency.setValue(amountInTargetCurrency);
      this.exchangeRate.setValue(values.exchangeRate ?? 0);
      this.memo.setValue(values.memo ?? '');
      this.payee.setValue(values.payee ?? '');
      this.id = values.id ?? '';
      this.runningBalance.setValue(values.runningBalance ?? 0);
      this.isClear = values.isClear ?? false;

      if (values.id) {
        this.mode = 'view';
      }
    });
  };

  updateRate = async () => {
    const rate = await this.updater(this.date.value);

    if (!rate) return;

    runInAction(() => {
      this.exchangeRate.setValue(rate);
    });
  };

  reset = () => {
    runInAction(() => {
      this.inflow.reset();
      this.outflow.reset();
      this.exchangeRate.reset();
      this.amountInTargetCurrency.reset();
      this.memo.reset();
      this.payee.reset();

      this.date.setValue(getCurrentDate());
    });
  };

  get values(): RowDTO {
    return {
      amountInBaseCurrency: this.amountInBaseCurrency.value,
      amountInTargetCurrency: this.amountInTargetCurrency.value,
      date: this.date.value,
      exchangeRate: this.exchangeRate.value,
      id: this.id,
      inflow: this.inflow.value,
      isClear: this.isClear,
      memo: this.memo.value,
      outflow: this.outflow.value,
      payee: this.payee.value,
      runningBalance: this.runningBalance.value,
    };
  }

  get isValid() {
    return [this.date, this.exchangeRate, this.amountInBaseCurrency].every((cell) => cell.isValid);
  }

  close = () => {
    this.mode = 'view';
  };

  open = () => {
    this.mode = 'edit';
  };

  get isClosed() {
    return this.mode === 'view' && this.isSaved;
  }

  get isOpen() {
    return this.mode === 'edit' || !this.isSaved;
  }

  get isSaved() {
    return !!this.id;
  }

  toggleMode = () => {
    this.mode = this.mode === 'view' ? 'edit' : 'view';
  };

  loadValues = (values: RowDTO) => {
    runInAction(() => {
      this.inflow.setValue(values.inflow);
      this.outflow.setValue(values.outflow);
      this.date.setValue(values.date);
      this.exchangeRate.setValue(values.exchangeRate);
      this.runningBalance.setValue(values.runningBalance);
    });
  };

  clear = () => {
    this.isClear = true;
  };

  unClear = () => {
    this.isClear = false;
  };

  toggleClear = () => {
    this.isClear = !this.isClear;
  };
}
