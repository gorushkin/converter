import { useEffect, useRef } from 'react';

import type { InputRef } from 'antd';
import { observer } from 'mobx-react-lite';
import { Cell } from 'src/entities/row';
import { Input } from 'src/shared/ui/Input/Input';

type DateInputProps = {
  cell: Cell<string>;
};

export const DateInput = observer((props: DateInputProps) => {
  const { cell } = props;

  const { isValid, setValue } = cell;

  const input = useRef<InputRef | null>(null);

  useEffect(() => {
    input.current?.focus();
  }, [cell.data.id]);

  return <Input inputRef={input} type="date" {...cell} name="date" onChange={setValue} isValid={isValid} />;
});
