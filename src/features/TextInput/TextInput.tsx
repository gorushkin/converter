import { observer } from 'mobx-react-lite';
import { Cell } from 'src/entities/row';
import { Input } from 'src/shared/ui/Input';

type TextInputProps = {
  cell: Cell<string>;
};

export const TextInput = observer(({ cell }: TextInputProps) => {
  const { setValue, value } = cell;

  return <Input onChange={setValue} name="memo" {...cell} value={value.toString()} />;
});
