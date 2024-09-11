import { Input } from 'src/shared/Input';
import { updateRow, validators } from 'src/store';
import { Row } from 'src/store/types';

type AmountInputProps = {
  values: Row;
};

export const AmountInput = ({ values }: AmountInputProps) => {
  const handleChange = (value: string) => {
    const sanitizeNumericInput = value.replace(/\D/g, '');

    updateRow('amount', sanitizeNumericInput);
  };

  return <Input onChange={handleChange} name="amount" validator={validators.amount} value={values.amount.toString()} />;
};
