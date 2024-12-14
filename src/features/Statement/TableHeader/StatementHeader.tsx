import { Input as AntdInput } from 'antd';
import { observer } from 'mobx-react-lite';
import type { Statement } from 'src/entities/statement';
import { statementsStore } from 'src/entities/statements';

import styles from './StatementHeader.module.scss';

const getData = (currentStatement: Statement) => {
  const { balance, inflow, outflow } = currentStatement;

  const leftData = [
    { label: 'Start balance', value: balance.startBalance },
    { label: 'End balance', value: balance.endBalance },
  ];

  const rightData = [
    { label: 'Total Inflow', value: inflow },
    { label: 'Total Outflow', value: outflow },
  ];

  return [leftData, rightData];
};

export const StatementHeader = observer(() => {
  const data = getData(statementsStore.currentStatement);

  return (
    <div className={styles.wrapper}>
      {data.map((item, index) => {
        return (
          <div key={index} className={styles.cell}>
            {item.map(({ label, value }) => (
              <div key={label} className={styles.cell}>
                <span className={styles.label}>{label}</span>
                <AntdInput className={styles.input} value={value} contentEditable={false} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
});
