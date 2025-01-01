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
};

const modeManager = new ModeManager();

export const RateInput = observer((props: RateInputProps) => {
  const {
    currentStatement: { updateRate },
  } = statementsStore;

  const { cell } = props;

  if (modeManager.isViewMode) {
    return (
      <div className={styles.wrapper}>
        <RenderCurrencyCell cell={cell} />
        <ActionButton variant="primary" onClick={modeManager.toggleMode}>
          edit
        </ActionButton>
      </div>
    );
  }

  const onRefreshClick = async () => {
    await updateRate();
    modeManager.toggleMode();
  };

  return (
    <div className={styles.wrapper}>
      <AmountInput cell={cell} />
      <ActionButton variant="success" onClick={modeManager.toggleMode}>
        save
      </ActionButton>
      {/*  eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <ActionButton variant="primary" onClick={onRefreshClick}>
        refresh
      </ActionButton>
    </div>
  );
});
