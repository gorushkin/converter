import { makeAutoObservable } from 'mobx';

export class Cell<T> {
  value: T;
  formatValidator: (value: string) => boolean;
  private initValue: T;

  constructor(value: T, validator: (value: string) => boolean = () => true) {
    this.value = value;
    this.initValue = value;
    this.formatValidator = validator;

    makeAutoObservable(this);
  }

  setValue = (value: T) => {
    this.value = value;
  };

  get isValid() {
    return this.formatValidator(String(this.value));
  }

  reset = () => {
    this.value = this.initValue;
  };

  get data() {
    return {
      isValid: this.isValid,
      value: this.value,
    };
  }
}
