import { RowValues } from 'src/store/row';

class Storage<T> {
  key = 'statement';
  initialData: T;

  constructor(initialData: T) {
    this.initialData = initialData;
  }

  get() {
    const data = localStorage.getItem(this.key);
    return data ? (JSON.parse(data) as T) : this.initialData;
  }

  set(data: T) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

export const statementStorage = new Storage<RowValues[]>([]);
