import { Input } from '@/shared/Input';
import { updateRow } from '@/store';
import { Row } from '@/store/types';

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
