import { Input } from 'src/shared/Input';
import { updateRow } from 'src/store';
import { Row } from 'src/store/types';

type AmountInputProps = {
  values: Row;
};

export const AmountInput = ({ values }: AmountInputProps) => {
  return (
    <Input
      onChange={(value) => {
        updateRow('amount', value);
      }}
      value={values.amount.toString()}
    />
  );
};
