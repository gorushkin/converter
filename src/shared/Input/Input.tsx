import { useEffect, useRef } from 'react';

import { Form, Input as AntdInput, InputRef } from 'antd';
import { observer } from 'mobx-react-lite';
import { store } from 'src/store';
import { InputType } from 'src/store/validators';

import styles from './Input.module.scss';

type InputProps = {
  onChange: (value: string) => void;
  value?: string;
  name: InputType;
  validator?: (value: string) => boolean;
  onFocus?: () => void;
  isValid: boolean;
  symbol: symbol;
};

export const Input = observer((props: InputProps) => {
  const { isValid, name, onChange, symbol, value = '' } = props;

  const validatingStatus = isValid ? 'success' : 'error';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const { isActive, setActiveInput } = store;

  const handleFocus = () => {
    setActiveInput(symbol);
  };

  const isInputActive = isActive(symbol);

  const input = useRef<InputRef | null>(null);

  useEffect(() => {
    if (isInputActive && input.current?.input) {
      input.current?.input.focus();
    }
  }, [isInputActive]);

  return (
    <Form.Item className={styles.wrapper} validateStatus={validatingStatus}>
      <AntdInput
        ref={input}
        autoComplete="off"
        onFocus={handleFocus}
        onChange={handleChange}
        name={name}
        value={value}
      />
    </Form.Item>
  );
});
