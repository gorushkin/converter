import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import type { Cell } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';
import { RenderCurrencyCell } from 'src/features/Statement/RenderCurrencyCell';
import { ActionButton } from 'src/shared/ui/ActionButton';
import { AmountInput } from 'src/shared/ui/AmountInput';

import styles from './RateInput.module.scss';

type RateInputProps = {
  cell: Cell<number>;
};

export const RateInput = observer((props: RateInputProps) => {
  const {
    currentStatement: { updateRate },
  } = statementsStore;

  const { cell } = props;

  const [mode, setMode] = useState<'edit' | 'view'>('view');

  const toggleState = () => {
    setMode((prev) => (prev === 'view' ? 'edit' : 'view'));
  };

  if (mode === 'view') {
    return (
      <div className={styles.wrapper}>
        <RenderCurrencyCell cell={cell} />
        <ActionButton variant="primary" onClick={toggleState}>
          edit
        </ActionButton>
      </div>
    );
  }

  const onRefreshClick = async () => {
    await updateRate();
    toggleState();
  };

  return (
    <div className={styles.wrapper}>
      <AmountInput cell={cell} />
      <ActionButton variant="success" onClick={toggleState}>
        save
      </ActionButton>
      {/*  eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <ActionButton variant="primary" onClick={onRefreshClick}>
        refresh
      </ActionButton>
    </div>
  );
});
