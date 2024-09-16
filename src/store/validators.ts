export type InputType = 'date' | 'amount';
export type ValueType = 'string' | 'number';

const dateValidator = (date: string) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;

  return dateRegex.test(date);
};

const amountValidator = (amount: string) => {
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  return amountRegex.test(amount) && parseFloat(amount) > 0;
};

export const validators: Record<InputType, (value: string) => boolean> = {
  amount: amountValidator,
  date: dateValidator,
};
