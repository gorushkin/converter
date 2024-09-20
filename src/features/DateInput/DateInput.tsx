import { observer } from 'mobx-react-lite';
import { Input } from 'src/shared/Input/Input';
import { Cell } from 'src/store';

const convertToFormattedDate = (value: string) => {
  const updatedValue = value
    .split('')
    .map((char, index) => {
      const extraChar = index === 2 || index === 4 ? '/' : '';

      return extraChar + char;
    })
    .join('');

  return updatedValue;
};

type DateInputProps = {
  cell: Cell<string>;
};

export const DateInput = observer(({ cell }: DateInputProps) => {
  const { isValid, setValue } = cell;

  const handleChange = (value: string) => {
    const sanitizeNumberInput = value.replace(/\D/g, '');

    const dateFormatted = convertToFormattedDate(sanitizeNumberInput);

    setValue(dateFormatted);
  };

  return <Input {...cell} name="date" onChange={handleChange} isValid={isValid} />;
});
