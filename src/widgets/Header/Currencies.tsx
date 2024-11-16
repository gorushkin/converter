import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statement } from 'src/entities/statement/model';
import { Currency } from 'src/shared/types';

import styles from './Currencies.module.scss';

const currencies: Currency[] = ['USD', 'EUR', 'NZD', 'TRY', 'RUB', 'GEL'];

export const Currencies = observer(() => {
  const { setTargetCurrency, targetCurrency } = statement;

  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <p>Base currency</p>
        <Button disabled type="primary">
          RUB
        </Button>
      </div>
      <div className={styles.column}>
        <p>Target currency</p>
        <div className={styles.buttonWrapper}>
          {currencies.map((currency) => {
            const isActive = currency === targetCurrency;
            const buttonType = isActive ? 'primary' : 'default';

            return (
              <Button type={buttonType} key={currency} onClick={() => setTargetCurrency(currency)}>
                {currency}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
