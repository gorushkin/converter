import { Button } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { statement } from 'src/entities/statement/model';
import { statements } from 'src/entities/statements';
import { SaveStatement } from 'src/features/SaveStatement';
import { useModal } from 'src/shared/hooks/useModal';

import styles from './Actions.module.scss';
export const Actions = observer(() => {
  const { isStatementExist, reset, sort } = statement;
  const { exportCSV, loadStatement } = statements;

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

  const [isSaveModalOpen, openSaveModal, closeSaveModal] = useModal();

  return (
    <div className={styles.wrapper}>
      <Button onClick={sort} type="primary">
        Sort by date
      </Button>
      <Button onClick={openSaveModal} type="primary">
        Save
      </Button>
      <Button disabled={!isStatementExist} onClick={loadStatement} type="primary">
        Import
      </Button>
      <Button onClick={reset} type="primary">
        Reset all
      </Button>
      <Button onClick={handleExport} type="primary">
        Export
      </Button>
      <SaveStatement isOpen={isSaveModalOpen} onClose={closeSaveModal} />
    </div>
  );
});
