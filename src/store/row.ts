import { makeAutoObservable } from 'mobx';

import { Cell } from './cell';
import { validators } from './validators';

export type RowValues = {
  amount: string;
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
    }

    makeAutoObservable(this);
  }

  reset = () => {
    this.amount.reset();
    this.date.reset();
    this.rate.reset();
    this.result.reset();
  };

  get values(): RowValues {
    return {
      amount: this.amount.value,
      date: this.date.value,
      id: this.id,
      isValid: this.isValid,
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
}
