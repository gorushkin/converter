import { useState } from 'react';

import { Bank, Currency } from 'src/shared/types';
import { CurrencySelector } from 'src/shared/ui/CurrencySelector';
import { Modal, type ModalType } from 'src/shared/ui/Modal/Modal';

import styles from './SettingsModal.module.scss';
import { BankSelector } from './ui/BankSelector';

type SelectCurrencyModalProps = {
  modal: ModalType;
  onSave: (currency: Currency, bank: Bank) => void;
};

export const SettingsModal = (props: SelectCurrencyModalProps) => {
  const { modal, onSave } = props;

  const [baseCurrency, setBaseCurrency] = useState<Currency>(Currency.USD);
  const [bank, setBank] = useState<Bank>(Bank.VAKIF);

  return (
    <Modal
      okButtonText="Save"
      title="Select bank and statement currency"
      modal={modal}
      onOk={() => onSave(baseCurrency, bank)}
    >
      <div className={styles.wrapper}>
        <BankSelector bank={bank} onChange={setBank} />
        <CurrencySelector baseCurrency={baseCurrency} onChange={setBaseCurrency} />
      </div>
    </Modal>
  );
};
