import { useEffect } from 'react';

import { Row } from 'antd';
import { statementsStore } from 'src/entities/statements';
import { Actions } from 'src/features/Actions';
import { StatementCurrency } from 'src/features/StatementCurrency';
import { StatementInfo } from 'src/widgets/StatementInfo';
import { StatementWidget } from 'src/widgets/StatementWidget';

import styles from './App.module.css';

export const App = () => {
  useEffect(() => {
    statementsStore.init();
  }, []);

  return (
    <Row className={styles.wrapper}>
      <div className={styles.header}>
        <StatementCurrency />
        <StatementInfo />
        <Actions />
      </div>
      <StatementWidget />
    </Row>
  );
};

export default App;
