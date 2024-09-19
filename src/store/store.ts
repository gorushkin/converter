import { makeAutoObservable } from 'mobx';

import { Row } from './row';

export class Store {
  _rows: Row[] = [];
  currentRow: Row;
  activeInput: 'date' | 'amount' = 'date';

  private counter = (): (() => string) => {
    let i = 0;

    return (): string => {
      i += 1;
      return i.toString();
    };
  };

  private getId = this.counter();

  constructor() {
    this.currentRow = new Row(this.getId());
    makeAutoObservable(this);
  }

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
}

export const store = new Store();
