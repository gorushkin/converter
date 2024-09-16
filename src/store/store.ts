import { makeAutoObservable } from 'mobx';
import { counter } from 'src/utils';

import { Row } from './row';

export class Store {
  _rows: Row[] = [];
  currentRow: Row;
  activeInput: 'date' | 'amount' = 'date';

  private getId = counter() as () => string;

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
