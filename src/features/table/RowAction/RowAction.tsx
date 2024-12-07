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
  const { createRow, removeRow, updateRow } = statementsStore.currentStatement;

  const handleRemoveClick = () => {
    removeRow(row.id);
  };

  const handleSaveClick = () => {
    if (row.isSaved) {
      updateRow(row.id, row.values);
    } else {
      createRow();
    }
  };

  const isSavingEnabled = row.isValid && row.isOpen;

  const isEditingEnabled = !row.isOpen;

  const buttonType = row.isSaved ? 'button' : 'submit';

  return (
    <div className={styles.wrapper}>
      <ActionButton color="#108ee9" disabled={!isEditingEnabled} onClick={row.toggleMode}>
        edit
      </ActionButton>
      <ActionButton color="#87d068" type={buttonType} disabled={!isSavingEnabled} onClick={handleSaveClick}>
        save
      </ActionButton>
      <ActionButton color="#f50" onClick={handleRemoveClick}>
        delete
      </ActionButton>
    </div>
  );
});
