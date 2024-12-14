import { StatementTable } from 'src/features/Statement/StatementTable';
import { StatementHeader } from 'src/features/Statement/TableHeader';
import { TableLog } from 'src/features/Statement/TableLog';

import styles from './StatementWidget.module.scss';
export const StatementWidget = () => {
  return (
    <div className={styles.wrapper}>
      <StatementHeader />
      <StatementTable />
      <TableLog />
    </div>
  );
};
