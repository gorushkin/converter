import { useRef } from 'react';

import { observer } from 'mobx-react-lite';
import type { Cell } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';
import { AmountInput } from 'src/features/Statement/AmountInput';
import { RenderCurrencyCell } from 'src/features/Statement/RenderCurrencyCell';
import { ActionButton } from 'src/shared/ui/ActionButton';
import { ModeManager } from 'src/utils/ModeManager';

import styles from './RateInput.module.scss';

type RateInputProps = {
  cell: Cell<number>;
  id: string;
};

export const RateInput = observer((props: RateInputProps) => {
  const {
    currentStatement: { updateRowRate: updateRate },
  } = statementsStore;

  const mode = useRef(new ModeManager());

  const { cell } = props;

  if (mode.current.isViewMode) {
    return (
      <div className={styles.wrapper}>
        <RenderCurrencyCell cell={cell} />
        <ActionButton variant="primary" onClick={mode.current.toggleMode}>
          edit
        </ActionButton>
      </div>
    );
  }

  const onRefreshClick = async () => {
    await updateRate(props.id);

    mode.current.toggleMode();
  };

  return (
    <div className={styles.wrapper}>
      <AmountInput cell={cell} />
      <ActionButton variant="success" onClick={mode.current.toggleMode}>
        save
      </ActionButton>
      {/*  eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <ActionButton variant="primary" onClick={onRefreshClick}>
        refresh
      </ActionButton>
    </div>
  );
});
