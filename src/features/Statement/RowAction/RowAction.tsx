import { observer } from 'mobx-react-lite';
import { type Row } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';
import { useModal } from 'src/shared/hooks/useModal/useModal';
import { ActionButton } from 'src/shared/ui/ActionButton';

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

  const isEditingEnabled = !row.isOpen;

  const isRowInEditMode = mode.isRowInEditMode(row.id);

  const modal = useModal();

  return (
    <div className={styles.wrapper}>
      <DeleteTransactionModal modal={modal} onOk={() => removeRow(row.id)} />
      {!isRowInEditMode && (
        <ActionButton variant="primary" disabled={!isEditingEnabled} onClick={onRowEditClick}>
          edit
        </ActionButton>
      )}
      {isRowInEditMode && (
        <ActionButton variant="success" type="submit" onClick={saveRow}>
          save
        </ActionButton>
      )}
      <ActionButton variant="alert" onClick={modal.open}>
        delete
      </ActionButton>
    </div>
  );
});
