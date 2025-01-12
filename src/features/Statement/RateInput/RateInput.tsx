import { observer } from 'mobx-react-lite';
import type { Cell } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';
import { AmountInput } from 'src/features/Statement/AmountInput';
import { ActionButton } from 'src/shared/ui/ActionButton';

import styles from './RateInput.module.scss';

type RateInputProps = {
  cell: Cell<number>;
};

export const RateInput = observer((props: RateInputProps) => {
  const {
    currentStatement: { updateRowRate },
  } = statementsStore;

  const { cell } = props;

  const onRefreshClick = async () => {
    alert('not implemented');
    // await updateRate(props.id);
  };

  return (
    <div className={styles.wrapper}>
      <AmountInput cell={cell} />
      {/*  eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <ActionButton variant="primary" onClick={onRefreshClick}>
        refresh
      </ActionButton>
    </div>
  );
});
