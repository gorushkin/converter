import { createElement, useState, type ChangeEvent } from 'react';

import { Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { ActionButton } from 'src/shared/ui/ActionButton';
import { ModeManager } from 'src/utils/ModeManager';
import { cn } from 'src/utils/tools';

import styles from './EditableField.module.scss';

type EditableFieldProps = {
  value?: string;
  onSubmit: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  withEditButton?: boolean;
};

const modeManager = new ModeManager();

export const EditableField = observer((props: EditableFieldProps) => {
  const { className, onSubmit, tag = 'div', value, withEditButton } = props;

  const [inputValue, setInputValue] = useState<string>(value ?? '');

  const { isViewMode, toggleMode } = modeManager;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const elementClassName = cn(styles.wrapper, className);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(inputValue);
    toggleMode();
  };

  if (isViewMode) {
    return (
      <div
        title="double click to edit"
        onDoubleClick={toggleMode}
        className={cn(styles.wrapper, isViewMode && styles.isViewMode)}
      >
        {createElement(tag, { className: elementClassName }, value)}

        {withEditButton && (
          <ActionButton variant="primary" onClick={toggleMode}>
            edit
          </ActionButton>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      {createElement(tag, { className: elementClassName }, <Input value={inputValue} onChange={handleChange} />)}
      <ActionButton type="submit" variant="success">
        save
      </ActionButton>
      <ActionButton variant="alert" onClick={() => setInputValue('')}>
        reset
      </ActionButton>
      <ActionButton variant="primary" onClick={toggleMode}>
        close
      </ActionButton>
    </form>
  );
});
