import { Form, Input as AntdInput } from 'antd';
import { InputType } from 'src/store/validators';

import styles from './Input.module.scss';

type InputProps = {
  onChange: (value: string) => void;
  value?: string;
  name: InputType;
  validator?: (value: string) => boolean;
  isValid?: boolean;
};

export const Input = ({ isValid, name, onChange, value }: InputProps) => {
  const status = isValid ? 'success' : 'error';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Form.Item className={styles.wrapper} validateStatus={status}>
      <AntdInput onChange={handleChange} name={name} value={value} />
    </Form.Item>
  );
};
