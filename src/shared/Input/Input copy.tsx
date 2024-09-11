import { useEffect, useRef, useState } from 'react';

import { setActiveInput, store } from 'src/store/store';
import { InputType } from 'src/store/types';

type Directions = 'left' | 'right';

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

const nextInputMap: Record<InputType, InputType> = {
  amount: 'date',
  date: 'amount',
};

const isLeftPressed = (key: Button) => key === Button.ArrowLeft;
const isRightPressed = (key: Button) => key === Button.ArrowRight;

const getNextInput = (name: InputType, direction: Directions) => {
  if (name === 'amount' && direction === 'left') {
    return 'date';
  }

  if (name === 'date' && direction === 'right') {
    return 'amount';
  }
};

export const Input = ({ name, onChange, value }: InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeInput = store.use.activeInput();

  const isInputActive = activeInput === name;

  const [inputPosition, setInputPosition] = useState<Directions | null>('left');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const [nextInput, setNextInput] = useState<InputType | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!inputPosition || !isInputActive) return;

      if ((e.key as Button) !== Button.ArrowLeft && (e.key as Button) !== Button.ArrowRight) return;

      const nextInputName = getNextInput(name, inputPosition);

      if (!nextInputName) return;

      if (isLeftPressed(e.key as Button) && inputPosition === 'left') {
        setNextInput(nextInputName);
      }

      if (isRightPressed(e.key as Button) && inputPosition === 'right') {
        setNextInput(nextInputName);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [name, inputPosition, isInputActive]);

  useEffect(() => {
    if (!nextInput) return;

    setActiveInput(nextInput);
    setNextInput(null);
  }, [nextInput]);

  useEffect(() => {
    if (!isInputActive || !inputRef.current) return;

    inputRef.current.focus();
  }, [activeInput, isInputActive]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { selectionStart } = e.target;

    if (selectionStart === 0) {
      return setInputPosition('left');
    }

    if (selectionStart === e.target.value.length) {
      return setInputPosition('right');
    }

    setInputPosition(null);
  };

  return (
    <div>
      <input
        onSelect={handleSelect}
        ref={inputRef}
        onChange={handleChange}
        name={name}
        style={{ border: isInputActive ? '5px solid red' : '5px solid black', outline: 'none' }}
        value={value}
        onFocus={() => {
          setActiveInput(name);
        }}
      />
      <button
        onClick={() => {
          setActiveInput(nextInputMap[name]);
        }}
      >
        {nextInputMap[name]}
      </button>
    </div>
  );
};
