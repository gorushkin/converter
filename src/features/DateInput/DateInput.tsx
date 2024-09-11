import { Input } from 'src/shared/Input/Input';
import { updateRow } from 'src/store';
import { Row } from 'src/store/types';

type DateInputProps = {
  values: Row;
};

const validateDate = (date: string) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;

  return dateRegex.test(date);
};

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

export const DateInput = ({ values }: DateInputProps) => {
  const handleChange = (value: string) => {
    const sanitizeNumberInput = value.replace(/\D/g, '');

    const dateFormatted = convertToFormattedDate(sanitizeNumberInput);

    updateRow('date', dateFormatted);
  };

  return <Input validator={validateDate} name="date" onChange={handleChange} value={values.date} />;
};
