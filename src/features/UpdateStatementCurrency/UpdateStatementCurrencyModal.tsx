import type { Currency } from 'src/shared/types';
import { Modal, type ModalType } from 'src/shared/ui/Modal';

type CurrencyModalProps = {
  modal: ModalType;
  currentCurrency: Currency;
  setBaseCurrency: (currency: Currency) => void;
  nextTargetCurrency: Currency;
};

export const UpdateStatementCurrencyModal = (props: CurrencyModalProps) => {
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
