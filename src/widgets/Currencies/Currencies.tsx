import { useState } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { statementsStore } from 'src/entities/statements';
import { useModal } from 'src/shared/hooks/useModal';
import { Currency } from 'src/shared/types';
import { Modal, type ModalType } from 'src/shared/ui/Modal';

import styles from './Currencies.module.scss';

const currencies: Currency[] = ['USD', 'EUR', 'NZD', 'TRY', 'RUB', 'GEL'];

type CurrencyModalProps = {
  modal: ModalType;
  currentCurrency: Currency;
  setBaseCurrency: (currency: Currency) => void;
  nextTargetCurrency: Currency;
};

const CurrencyModal = (props: CurrencyModalProps) => {
  const { currentCurrency, modal, nextTargetCurrency, setBaseCurrency } = props;

  const handleChange = () => {
    setBaseCurrency(nextTargetCurrency);
  };

  return (
    <Modal okButtonText="Save" title="Updating base currency" modal={modal} onOk={handleChange}>
      <p>
        Do you want to change base currency from {currentCurrency} to {nextTargetCurrency}?
      </p>
    </Modal>
  );
};

export const Currencies = observer(() => {
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
        <CurrencyModal
          currentCurrency={baseCurrency}
          modal={modal}
          setBaseCurrency={setBaseCurrency}
          nextTargetCurrency={currentCurrency}
        />
        <p>Base currency</p>
        <div className={styles.buttonWrapper}>
          {currencies.map((currency) => {
            const isActive = currency === baseCurrency;
            const buttonType = isActive ? 'primary' : 'default';

            return (
              <Button type={buttonType} key={currency} onClick={() => handleClick(currency)}>
                {currency}
              </Button>
            );
          })}
        </div>
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
