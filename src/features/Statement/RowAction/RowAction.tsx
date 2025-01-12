import { observer } from 'mobx-react-lite';
import { type Row } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';
import { ActionButton } from 'src/shared/ui/ActionButton';

import styles from './RowAction.module.scss';

type RowActionProps = {
  className?: string;
  row: Row;
};
export const RowAction = observer(({ row }: RowActionProps) => {
  const { removeRow, saveRow } = statementsStore.currentStatement;

  const handleRemoveClick = () => {
    removeRow(row.id);
  };

  const onRowEditClick = () => {
    statementsStore.currentStatement.setCurrentRow(row.id);
  };

  const isSavingEnabled = row.isOpen;

  const isEditingEnabled = !row.isOpen;

  return (
    <div className={styles.wrapper}>
      <ActionButton variant="primary" disabled={!isEditingEnabled} onClick={onRowEditClick}>
        edit
      </ActionButton>
      <ActionButton variant="success" type="submit" disabled={!isSavingEnabled} onClick={saveRow}>
        save
      </ActionButton>
      <ActionButton variant="alert" onClick={handleRemoveClick}>
        delete
      </ActionButton>
    </div>
  );
});
