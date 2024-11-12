import { observer } from 'mobx-react-lite';
import { Input } from 'src/shared/Input';
import { Cell } from 'src/store';

type TextInputProps = {
  cell: Cell<string>;
};

export const TextInput = observer(({ cell }: TextInputProps) => {
  const { setValue, value } = cell;

  return <Input onChange={setValue} name="memo" {...cell} value={value.toString()} />;
});
