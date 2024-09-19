import { makeAutoObservable } from 'mobx';

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
  mode: 'edit' | 'view' = 'edit';

  constructor(id: string) {
    this.isValid = false;
    this.id = id;

    makeAutoObservable(this);
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

  close = () => {
    this.mode = 'view';
  };

  edit = () => {
    this.mode = 'edit';
  };
}
