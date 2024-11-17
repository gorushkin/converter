import { Button } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { LoadStatement } from 'src/features/LoadStatement';
import { SaveStatement } from 'src/features/SaveStatement';
import { useModal } from 'src/shared/hooks/useModal';

import styles from './Actions.module.scss';
export const Actions = observer(() => {
  const { currentStatement, exportCSV, updateStatement } = statementsStore;
  const { isSaved, reset, sort, statement } = currentStatement;

  const handleExport = () => {
    const blob = exportCSV();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const title = dayjs().toISOString();
    link.download = `${title}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  const saveModal = useModal();
  const loadModal = useModal();

  const handleSaveClick = () => {
    if (isSaved) {
      updateStatement(statement);
    } else {
      saveModal.open();
    }
  };

  return (
    <div className={styles.wrapper}>
      <Button onClick={sort} type="primary">
        Sort by date
      </Button>
      <Button onClick={handleSaveClick} type="primary">
        Save
      </Button>
      <Button disabled={statementsStore.statements.length === 0} onClick={loadModal.open} type="primary">
        Load
      </Button>
      <Button onClick={reset} type="primary">
        Reset all
      </Button>
      <Button onClick={handleExport} type="primary">
        Export
      </Button>
      <SaveStatement isOpen={saveModal.isOpen} onClose={saveModal.close} />
      <LoadStatement isOpen={loadModal.isOpen} onClose={loadModal.close} />
    </div>
  );
});
