import { observer } from 'mobx-react-lite';
import { type Row } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';
import { useModal } from 'src/shared/hooks/useModal/useModal';
import { ActionButton } from 'src/shared/ui/ActionButton';
import { cn } from 'src/utils/tools';

import { DeleteTransactionModal } from './DeleteTransactionModal';
import styles from './RowAction.module.scss';

type RowActionProps = {
  className?: string;
  row: Row;
};
export const RowAction = observer(({ row }: RowActionProps) => {
  const { mode, removeRow, saveRow } = statementsStore.currentStatement;

  const onRowEditClick = () => {
    statementsStore.currentStatement.setCurrentRow(row.id);
  };

  const isRowInEditMode = mode.isRowInEditMode(row.id);

  const modal = useModal();

  return (
    <div className={styles.wrapper}>
      <DeleteTransactionModal modal={modal} onOk={() => removeRow(row.id)} />
      <ActionButton variant="primary" disabled={isRowInEditMode || row.isClear} onClick={onRowEditClick}>
        edit
      </ActionButton>
      <ActionButton variant="success" disabled={!isRowInEditMode} type="submit" onClick={saveRow}>
        save
      </ActionButton>
      <ActionButton variant="alert" disabled={row.isClear} onClick={modal.open}>
        delete
      </ActionButton>
      <button className={styles.clearButton} onClick={row.toggleClear}>
        <div className={cn(styles.clear, row.isClear && styles.checked)}></div>
      </button>
    </div>
  );
});
