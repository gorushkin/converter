import { Button } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { store } from 'src/store';

import styles from './Actions.module.scss';
export const Actions = observer(() => {
  const { exportCSV, importStatement, isStatementExist, reset, save, sort } = store;

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

  return (
    <div className={styles.wrapper}>
      <Button onClick={sort} type="primary">
        Sort by date
      </Button>
      <Button onClick={save} type="primary">
        Save
      </Button>
      <Button disabled={!isStatementExist} onClick={importStatement} type="primary">
        Import
      </Button>
      <Button onClick={reset} type="primary">
        Reset all
      </Button>
      <Button onClick={handleExport} type="primary">
        Export
      </Button>
    </div>
  );
});
