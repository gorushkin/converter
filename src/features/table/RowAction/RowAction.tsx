import { observer } from 'mobx-react-lite';
import { type Row } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements';

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

  const handleSaveClick = () => {
    saveRow();
  };

  const isButtonEnabled = row.isValid && row.isEditMode;

  return (
    <div className={styles.wrapper}>
      <button type="submit" disabled={!isButtonEnabled} onClick={handleSaveClick}>
        save
      </button>
      <button type="button" onClick={handleRemoveClick}>
        delete
      </button>
    </div>
  );
});
