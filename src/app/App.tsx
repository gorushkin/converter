import { Row } from 'antd';

import styles from './App.module.css';

import { Body } from '@/widgets/Body';
import { Header } from '@/widgets/Header/Header';

export const App = () => {
  return (
    <Row className={styles.wrapper}>
      <Header />
      <Body />
    </Row>
  );
};

export default App;
