import { Bank } from 'src/shared/types';
import { Selector } from 'src/shared/ui/Selector';

type BankSelectorProps = {
  bank: Bank;
  onChange: (bank: Bank) => void;
};

const bankOptions = Object.values(Bank).map((bank) => ({
  label: bank,
  value: bank,
}));

export const BankSelector = (props: BankSelectorProps) => {
  const { bank, onChange } = props;

  return <Selector options={bankOptions} selectedOption={bank} onChange={onChange} />;
};
