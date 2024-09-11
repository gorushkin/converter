import { Form, Input as AntdInput } from 'antd';
import { InputType } from 'src/store/types';

type InputProps = {
  onChange: (value: string) => void;
  value?: string;
  name: InputType;
  validator?: (value: string) => boolean;
};

export const Input = ({ name, onChange, validator, value }: InputProps) => {
  const status = validator ? (validator(value ?? '') ? 'success' : 'error') : 'success';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Form.Item validateStatus={status}>
      <AntdInput onChange={handleChange} name={name} value={value} />
    </Form.Item>
  );
};
