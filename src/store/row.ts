import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { getCurrentDate } from 'src/utils';

import { Cell } from './cell';
import { validators } from './validators';

export type RowValues = {
  inflow: string;
  outflow: string;
  memo: string;
  payee: string;
  date: string;
  id: string;
  isValid: boolean;
  rate: string;
};

export class Row {
  id: string;
  inflow = new Cell(0);
  outflow = new Cell(0);
  amount = new Cell(0, validators.number);
  date = new Cell('', validators.date);
  rate = new Cell(0);
  memo = new Cell('');
  payee = new Cell('');
  result = new Cell(0);
  mode: 'edit' | 'view' = 'edit';
  inputs: symbol[] = [this.date.symbol, this.inflow.symbol, this.outflow.symbol];

  constructor(id: string, values: Partial<RowValues> = {}) {
    this.id = id;

    this.date.setValue(values.date ?? getCurrentDate());

    if (values.inflow) {
      this.inflow.setValue(values.inflow);
    }

    if (values.outflow) {
      this.outflow.setValue(values.outflow);
    }

    if (values.rate) {
      this.rate.setValue(values.rate);
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
        this.amount.setValue(Number(this.inflow.value) - Number(this.outflow.value));
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
      this.rate.reset();
      this.result.reset();
      this.memo.reset();
      this.payee.reset();

      this.date.setValue(getCurrentDate());
    });
  };

  get values(): RowValues {
    return {
      date: this.date.value,
      id: this.id,
      inflow: this.inflow.value,
      isValid: this.isValid,
      memo: this.memo.value,
      outflow: this.outflow.value,
      payee: this.payee.value,
      rate: this.rate.value,
    };
  }

  get isValid() {
    return [this.date, this.rate, this.amount].every((cell) => cell.isValid);
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

  loadValues = (values: RowValues) => {
    runInAction(() => {
      this.inflow.setValue(values.inflow);
      this.outflow.setValue(values.outflow);
      this.date.setValue(values.date);
      this.rate.setValue(values.rate);
    });
  };
}
