import { Input } from 'src/shared/Input';
import { updateRow } from 'src/store';
import { Row } from 'src/store/types';

type AmountInputProps = {
  values: Row;
};

const validateNumber = (number: string) => {
  return !isNaN(Number(number));
};

export const AmountInput = ({ values }: AmountInputProps) => {
  const handleChange = (value: string) => {
    const sanitizeNumericInput = value.replace(/\D/g, '');

    updateRow('amount', sanitizeNumericInput);
  };

  return <Input onChange={handleChange} name="amount" validator={validateNumber} value={values.amount.toString()} />;
};
