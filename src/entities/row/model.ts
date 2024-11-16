import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { validators } from 'src/shared/utils';
import { getCurrentDate } from 'src/utils';

import { Cell } from './cell';
import type { RowDTO } from './types';

export class Row {
  id: string;
  inflow = new Cell(0);
  outflow = new Cell(0);
  amountInBaseCurrency = new Cell(0, validators.number);
  date = new Cell('', validators.date);
  exchangeRate = new Cell(0);
  memo = new Cell('');
  payee = new Cell('');
  amountInTargetCurrency = new Cell(0);
  mode: 'edit' | 'view' = 'edit';
  inputs: symbol[] = [this.date.symbol, this.inflow.symbol, this.outflow.symbol];

  constructor(id: string, values: Partial<RowDTO> = {}) {
    this.id = id;

    this.date.setValue(values.date ?? getCurrentDate());

    if (values.inflow) {
      this.inflow.setValue(values.inflow);
    }

    if (values.outflow) {
      this.outflow.setValue(values.outflow);
    }

    if (values.exchangeRate) {
      this.exchangeRate.setValue(values.exchangeRate);
    }

    if (values.memo) {
      this.memo.setValue(values.memo);
    }

    if (values.payee) {
      this.payee.setValue(values.payee);
    }

    makeAutoObservable(this);

    reaction(
      () => [this.inflow.value, this.outflow.value],
      () => {
        this.amountInBaseCurrency.setValue(Number(this.inflow.value) - Number(this.outflow.value));
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
  }

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
      date: this.date.value,
      exchangeRate: this.exchangeRate.value,
      id: this.id,
      inflow: this.inflow.value,
      isValid: this.isValid,
      memo: this.memo.value,
      outflow: this.outflow.value,
      payee: this.payee.value,
    };
  }

  get isValid() {
    return [this.date, this.exchangeRate, this.amountInBaseCurrency].every((cell) => cell.isValid);
  }

  close = () => {
    this.mode = 'view';
  };

  edit = () => {
    this.mode = 'edit';
  };

  get isViewMode() {
    return this.mode === 'view';
  }

  get isEditMode() {
    return this.mode === 'edit';
  }

  loadValues = (values: RowDTO) => {
    runInAction(() => {
      this.inflow.setValue(values.inflow);
      this.outflow.setValue(values.outflow);
      this.date.setValue(values.date);
      this.exchangeRate.setValue(values.exchangeRate);
    });
  };
}
