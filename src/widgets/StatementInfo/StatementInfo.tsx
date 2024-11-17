import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';

import styles from './StatementInfo.module.scss';

export const StatementInfo = observer(() => {
  const { name } = statementsStore.currentStatement;
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{name}</h1>
    </div>
  );
});
