import { makeAutoObservable } from 'mobx';

type Validator = (value: string) => boolean;

const defaultValidator: Validator = () => true;

export class Cell<T> {
  value: string;
  validator: Validator;
  private initValue: string;
  symbol = Symbol();

  constructor(value: T, validator?: Validator) {
    this.value = String(value);
    this.initValue = String(value);
    this.validator = validator ?? defaultValidator;

    makeAutoObservable(this);
  }

  setValue = (value: string | number) => {
    this.value = String(value);
  };

  get isValid() {
    return this.validator(this.value);
  }

  reset = () => {
    this.value = this.initValue;
  };

  get data() {
    return {
      id: this.symbol,
      isValid: this.isValid,
      value: this.value,
    };
  }

  get rawData() {
    return this.value;
  }
}
