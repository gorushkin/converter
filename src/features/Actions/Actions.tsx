import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { ExportStatement } from 'src/features/ExportStatement';
import { ImportStatement } from 'src/features/ImportStatement';
import { LoadStatement } from 'src/features/LoadStatement';
import { SaveStatement } from 'src/features/SaveStatement';
import { SettingsButton } from 'src/features/SettingsButton';
import { useModal } from 'src/shared/hooks/useModal';

import styles from './Actions.module.scss';

export const Actions = observer(() => {
  const { currentStatement, updateStatement } = statementsStore;
  const { isSaved, reset, sort, statement } = currentStatement;

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
      <ExportStatement />
      <ImportStatement />
      <SaveStatement isOpen={saveModal.isOpen} onClose={saveModal.close} />
      <LoadStatement isOpen={loadModal.isOpen} onClose={loadModal.close} />
      <SettingsButton className={styles.right} />
    </div>
  );
});
