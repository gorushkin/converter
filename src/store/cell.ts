import { makeAutoObservable } from 'mobx';

type Validator = (value: string) => boolean;

const defaultValidator: Validator = () => true;

export class Cell<T> {
  value: string;
  validator = defaultValidator;
  private initValue: string;

  constructor(value: T, validator?: Validator) {
    this.value = String(value);
    this.initValue = String(value);
    if (validator) {
      this.validator = validator;
    }

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
      isValid: this.isValid,
      value: this.value,
    };
  }
}
