import { useState } from 'react';

export const Test = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const [activeInput, setActiveInput] = useState('date');

  const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setActiveInput(e.target.name);
  };

  return (
    <div>
      <div>
        <input
          onFocus={handleFocus}
          name="date"
          type="text"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
        <input
          onFocus={handleFocus}
          name="amount"
          type="text"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
        />
      </div>
    </div>
  );
};
