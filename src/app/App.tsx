import { Row } from 'antd';
import { Body } from 'src/widgets/Body';
import { Header } from 'src/widgets/Header';

import styles from './App.module.css';

export const App = () => {
  return (
    <Row className={styles.wrapper}>
      <Header />
      <Body />
    </Row>
  );
};

export default App;
