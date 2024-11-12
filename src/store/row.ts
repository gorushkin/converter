import { makeAutoObservable } from 'mobx';

import { Cell } from './cell';
import { validators } from './validators';

export type RowValues = {
  amount: string;
  memo: string;
  payee: string;
  date: string;
  id: string;
  isValid: boolean;
  rate: string;
};

type ActiveInputType = symbol | null;

export class Row {
  id: string;
  amount = new Cell(0, validators.number);
  date = new Cell('', validators.date);
  rate = new Cell(0, validators.number);
  memo = new Cell('');
  payee = new Cell('');
  result = new Cell(0);
  mode: 'open' | 'closed' = 'open';
  activeInput: ActiveInputType = null;
  inputs: symbol[] = [this.date.symbol, this.amount.symbol];

  constructor(id: string, values?: RowValues) {
    this.id = id;
    this.setActiveInput(this.date.symbol);

    if (values) {
      this.amount.setValue(values.amount);
      this.date.setValue(values.date);
      this.rate.setValue(values.rate);
      this.memo.setValue(values.memo);
    }

    makeAutoObservable(this);
  }

  reset = () => {
    this.amount.reset();
    this.date.reset();
    this.rate.reset();
    this.result.reset();
    this.memo.reset();
    this.payee.reset();
  };

  get values(): RowValues {
    return {
      amount: this.amount.value,
      date: this.date.value,
      id: this.id,
      isValid: this.isValid,
      memo: this.memo.value,
      payee: this.payee.value,
      rate: this.rate.value,
    };
  }

  get isValid() {
    return [this.amount, this.date, this.rate].every((cell) => cell.isValid);
  }

  close = () => {
    this.mode = 'closed';
  };

  edit = () => {
    this.mode = 'open';
  };

  get isOpen() {
    return this.mode === 'closed';
  }

  get isClosed() {
    return this.mode === 'open';
  }

  setActiveInput = (symbol: ActiveInputType) => {
    this.activeInput = symbol;
  };

  get isActive() {
    return (symbol: ActiveInputType) => symbol === this.activeInput;
  }

  switchActiveInput = () => {
    if (!this.activeInput) {
      return;
    }

    const currentIndex = this.inputs.indexOf(this.activeInput);

    if (currentIndex === this.inputs.length - 1) {
      return this.setActiveInput(this.inputs[0]);
    }

    this.setActiveInput(this.inputs[currentIndex + 1]);
  };

  get isRowReady() {
    if (!this.activeInput) {
      return this.isValid;
    }

    return this.activeInput === this.inputs[this.inputs.length - 1];
  }

  get rawDate() {
    return [this.amount, this.date, this.rate].map((cell) => cell.rawData);
  }

  loadValues = (values: RowValues) => {
    this.amount.setValue(values.amount);
    this.date.setValue(values.date);
    this.rate.setValue(values.rate);
  };
}
