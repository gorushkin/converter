import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { Currency } from 'src/shared/types';
import { store } from 'src/store';

import styles from './Header.module.scss';

const currencies: Currency[] = ['USD', 'EUR', 'NZD', 'TRY', 'RUB'];

export const Header = observer(() => {
  const { setTargetCurrency, targetCurrency } = store;

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
