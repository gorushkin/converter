import { observer } from 'mobx-react-lite';
import { settings } from 'src/entities/settings/settings';
import { BankSelector } from 'src/shared/ui/BankSelector';
import { CurrencySelector } from 'src/shared/ui/CurrencySelector';

import styles from './ImportSettings.module.scss';

export const ImportSettings = observer(() => {
  const { bank, baseCurrency, isOpen, setBank, setBaseCurrency } = settings;

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <BankSelector bank={bank} onChange={setBank} />
      <CurrencySelector baseCurrency={baseCurrency} onChange={setBaseCurrency} />
    </div>
  );
});
