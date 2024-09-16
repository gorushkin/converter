import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { getRate } from 'src/api';
import { counter } from 'src/utils';

import { Cell } from './cell';
import { validators } from './validators';

type RowValues = {
  amount: number;
  date: string;
  id: string;
  isValid: boolean;
  rate: number;
};

export class Row {
  isValid = false;
  id: string;
  amount: Cell<number>;
  date: Cell<string>;
  rate = new Cell<number>(0);
  result = new Cell<number>(0);
  getId = counter() as () => string;
  mode: 'edit' | 'view' = 'edit';

  constructor(id: string) {
    this.isValid = false;
    this.id = id;
    this.amount = new Cell(0, validators.amount);
    this.date = new Cell('', validators.date);

    makeAutoObservable(this);

    reaction(
      () => [this.amount.data, this.date.data],
      ([amount, data]) => {
        if (amount.isValid && data.isValid) {
          this.isValid = true;
          void this.updateRate();
        }
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
      rate: 0,
    };
  }

  updateRate = async () => {
    const rate = await getRate(this.date.value, 'usd');
    runInAction(() => {
      this.rate.setValue(rate);
      this.result.setValue(this.amount.value * rate);
    });
  };

  close = () => {
    this.mode = 'view';
  };

  edit = () => {
    this.mode = 'edit';
  };
}
