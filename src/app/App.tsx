import { Row } from 'antd';
import { Actions } from 'src/features/Actions';
import { Body } from 'src/widgets/Body';
import { Currencies } from 'src/widgets/Header';

import styles from './App.module.css';

export const App = () => {
  return (
    <Row className={styles.wrapper}>
      <div className={styles.header}>
        <Currencies />
        <Actions />
      </div>
      <Body />
    </Row>
  );
};

export default App;
