import { observer } from 'mobx-react-lite';
import { type Row } from 'src/entities/row';
import { statement } from 'src/entities/statement';

import styles from './RowAction.module.scss';

type RowActionProps = {
  className?: string;
  row: Row;
};
export const RowAction = observer(({ row }: RowActionProps) => {
  const handleRemoveClick = () => {
    statement.removeRow(row.id);
  };

  const handleSaveClick = () => {
    statement.saveRow();
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
