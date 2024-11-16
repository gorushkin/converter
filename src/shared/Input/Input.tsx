import { useRef, type ChangeEvent } from 'react';

import { Form, Input as AntdInput, type InputRef } from 'antd';
import { observer } from 'mobx-react-lite';
import { InputType } from 'src/store/validators';

import styles from './Input.module.scss';

type InputProps = {
  onChange: (value: string) => void;
  value?: string;
  name: InputType;
  validator?: (value: string) => boolean;
  onFocus?: () => void;
  isValid?: boolean;
  symbol: symbol;
  type?: 'text' | 'number' | 'date';
  inputRef: React.MutableRefObject<InputRef | null>;
};

export const Input = observer((props: InputProps) => {
  const { inputRef, isValid, name, onChange, type = 'text', value = '' } = props;

  const validatingStatus = isValid ? 'success' : 'error';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const input = useRef<InputRef | null>(null);

  const handleFocus = () => {
    input.current?.select();
  };

  return (
    <Form.Item className={styles.wrapper} validateStatus={validatingStatus}>
      <AntdInput
        onFocus={handleFocus}
        ref={inputRef ?? input}
        autoComplete="off"
        onChange={handleChange}
        name={name}
        value={value}
        type={type}
      />
    </Form.Item>
  );
});
