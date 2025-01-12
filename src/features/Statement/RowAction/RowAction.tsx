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
  const { mode, removeRow, saveRow } = statementsStore.currentStatement;

  const handleRemoveClick = () => {
    removeRow(row.id);
  };

  const onRowEditClick = () => {
    statementsStore.currentStatement.setCurrentRow(row.id);
  };

  const isEditingEnabled = !row.isOpen;

  const isRowInEditMode = mode.isEditable(row.id);

  return (
    <div className={styles.wrapper}>
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
      <ActionButton variant="alert" onClick={handleRemoveClick}>
        delete
      </ActionButton>
    </div>
  );
});
