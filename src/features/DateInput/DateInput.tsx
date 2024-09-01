import { getRate } from 'src/api';
import { Input } from 'src/shared/Input/Input';
import { updateRow } from 'src/store';
import { Row } from 'src/store/types';

type DateInputProps = {
  values: Row;
};

export const DateInput = ({ values }: DateInputProps) => {
  const handleChange = (value: string) => {
    const rate = getRate(value, 'usd');
    updateRow('date', value);
    updateRow('rate', rate.toString());
  };

  return <Input onChange={handleChange} value={values.date} />;
};
