import { useEffect, useRef, useState } from 'react';

import { Input as AntInput, InputRef } from 'antd';
import { setActiveInput, store } from 'src/store/store';
import { InputType } from 'src/store/types';

type InputProps = {
  onChange: (value: string) => void;
  value?: string;
  name: InputType;
};

enum Button {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Enter = 'Enter',
}

const isLeftPressed = (key: Button) => key === Button.ArrowLeft;
const isRightPressed = (key: Button) => key === Button.ArrowRight;

export const Input = ({ name, onChange, value }: InputProps) => {
  const inputRef = useRef<InputRef | null>(null);

  const activeInput = store.use.activeInput();

  const [state, setState] = useState<'left' | 'middle' | 'right'>('left');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isLeftPressed(e.key as Button) && inputRef.current && state === 'left') {
        console.log('switch left');
      }
      if (isRightPressed(e.key as Button) && inputRef.current && state === 'right') {
        console.log('switch right');
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [state]);

  useEffect(() => {
    if (activeInput === name) {
      inputRef.current?.focus();
    }
  }, [activeInput, name]);

  return (
    <AntInput
      onSelect={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.selectionStart === 0) {
          setState('left');
        } else if (e.target.selectionStart === e.target.value.length) {
          setState('right');
        } else {
          setState('middle');
        }
      }}
      ref={inputRef}
      onChange={handleChange}
      name={name}
      value={value}
      onFocus={() => {
        setActiveInput(name);
      }}
    />
  );
};
