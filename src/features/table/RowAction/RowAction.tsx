import { observer } from 'mobx-react-lite';
import { store, type Row } from 'src/store';

import styles from './RowAction.module.scss';

type RowActionProps = {
  className?: string;
  row: Row;
};
export const RowAction = observer(({ row }: RowActionProps) => {
  const handleRemoveClick = () => {
    store.removeRow(row.id);
  };

  const handleSaveClick = () => {
    store.saveRow();
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
