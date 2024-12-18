import { useState } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { UpdateStatementCurrencyModal } from 'src/features/UpdateStatementCurrency/UpdateStatementCurrencyModal';
import { useModal } from 'src/shared/hooks/useModal';
import { Currency } from 'src/shared/types';
import { CurrencySelector } from 'src/shared/ui/CurrencySelector';

import styles from './StatementCurrency.module.scss';

export const StatementCurrency = observer(() => {
  const { baseCurrency, setBaseCurrency } = statementsStore.currentStatement;

  const [currentCurrency, setCurrentCurrency] = useState<Currency>(baseCurrency);

  const modal = useModal();

  const handleClick = (currency: Currency) => {
    setCurrentCurrency(currency);
    modal.open();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <UpdateStatementCurrencyModal
          currentCurrency={baseCurrency}
          modal={modal}
          setBaseCurrency={setBaseCurrency}
          nextTargetCurrency={currentCurrency}
        />
        <p>Base currency</p>
        <CurrencySelector baseCurrency={baseCurrency} onChange={handleClick} />
      </div>
      <div className={styles.column}>
        <p>Target currency</p>
        <Button disabled type="primary">
          RUB
        </Button>
      </div>
    </div>
  );
});
