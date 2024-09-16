import { observer } from 'mobx-react-lite';
import { Input } from 'src/shared/Input';
import { Cell } from 'src/store';

type AmountInputProps = {
  cell: Cell<number>;
};

export const AmountInput = observer(({ cell }: AmountInputProps) => {
  const { isValid, setValue, value } = cell;

  const handleChange = (value: string) => {
    const sanitizeNumericInput = value.replace(/\D/g, '');
    setValue(Number(sanitizeNumericInput));
  };

  return <Input onChange={handleChange} name="amount" isValid={isValid} value={value.toString()} />;
});
