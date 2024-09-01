import { getRate } from '@/api';
import { Input } from '@/shared/Input/Input';
import { updateRow } from '@/store';
import { Row } from '@/store/types';

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
