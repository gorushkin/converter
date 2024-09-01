import { useState } from 'react';

import { Button } from 'antd';

import styles from './Header.module.scss';

type Currency = 'USD' | 'EUR' | 'NZD' | 'TRY' | 'RUB';

const currencies: Currency[] = ['USD', 'EUR', 'NZD', 'TRY', 'RUB'];

export const Header = () => {
  const [baseCurrency, setBaseCurrency] = useState<Currency>('USD');

  const handleBaseCurrencyChange = (currency: Currency) => {
    setBaseCurrency(currency);
  };

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
            const isActive = currency === baseCurrency;
            const buttonType = isActive ? 'primary' : 'default';

            return (
              <Button type={buttonType} key={currency} onClick={() => handleBaseCurrencyChange(currency)}>
                {currency}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
