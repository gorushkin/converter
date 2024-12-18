import { StatementEditableName } from 'src/features/Statement/StatementEditableName';

import styles from './StatementInfo.module.scss';

export const StatementInfo = () => {
  return (
    <div className={styles.wrapper}>
      <StatementEditableName />
    </div>
  );
};
