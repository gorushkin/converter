import { observer } from 'mobx-react-lite';
import { Input } from 'src/shared/Input';
import { Cell } from 'src/store';

type AmountInputProps = {
  cell: Cell<number>;
};

export const AmountInput = observer(({ cell }: AmountInputProps) => {
  const { setValue, value } = cell;

  // TODO: return sanitizeNumericInput

  return <Input onChange={setValue} name="amount" {...cell} value={value.toString()} isValid={cell.isValid} />;
});
