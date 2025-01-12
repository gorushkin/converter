import { useState } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { LogInfo } from 'src/shared/ui/LogInfo';

import styles from './TableLog.module.scss';

export const TableLog = observer(() => {
  const { currentStatement } = statementsStore;

  const statementLog = currentStatement.statement;
  const rowLog = currentStatement.currentRow?.values;

  const [showStatementLog, setShowStatementLog] = useState(false);
  const [showRowLog, setShowRowLog] = useState(true);

  const handleShowStatementLog = () => {
    setShowStatementLog((prev) => !prev);
  };

  const handleShowRowLog = () => {
    setShowRowLog((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonsWrapper}>
        <Button onClick={handleShowStatementLog}>Show table log</Button>
        <Button onClick={handleShowRowLog}>Show row log</Button>
      </div>
      <div className={styles.logWrapper}>
        {showStatementLog && (
          <div className={styles.log}>
            <LogInfo data={statementLog} />{' '}
          </div>
        )}
        {showRowLog && <div className={styles.log}>{rowLog && <LogInfo data={rowLog} />}</div>}
      </div>
    </div>
  );
});
