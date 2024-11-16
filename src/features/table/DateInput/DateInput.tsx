import { useEffect, useRef } from 'react';

import type { InputRef } from 'antd';
import { observer } from 'mobx-react-lite';
import { Input } from 'src/shared/Input/Input';
import { Cell } from 'src/store';

type DateInputProps = {
  cell: Cell<string>;
};

export const DateInput = observer(({ cell }: DateInputProps) => {
  const { isValid, setValue } = cell;

  const handleChange = (value: string) => {
    setValue(value);
  };

  const input = useRef<InputRef | null>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  return <Input inputRef={input} type="date" {...cell} name="date" onChange={handleChange} isValid={isValid} />;
});
