import { observer } from 'mobx-react-lite';
import type { Cell } from 'src/entities/row';
import { Input } from 'src/shared/ui/Input';

type AmountInputProps = {
  cell: Cell<number>;
};

export const AmountInput = observer(({ cell }: AmountInputProps) => {
  const { setValue, value } = cell;

  return <Input onChange={setValue} name="amount" {...cell} value={value.toString()} isValid={cell.isValid} />;
});
