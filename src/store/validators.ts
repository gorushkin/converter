import { validateUserDate } from 'src/utils';

export type InputType = 'date' | 'amount';
export type ValueType = 'string' | 'number';

const dateValidator = (date: string) => validateUserDate(date);

export const numberValidator = (amount: string) => {
  const number = Number(amount);
  return !isNaN(number) && number > 0;
};

export const validators = {
  date: dateValidator,
  number: numberValidator,
};
