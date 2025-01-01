import { currencies, type Currency } from 'src/shared/types';
import { Selector } from 'src/shared/ui/Selector';

type CurrencySelectorProps = {
  baseCurrency: Currency;
  onChange: (currency: Currency) => void;
};

const currencyOptions = currencies.map((currency) => ({
  label: currency,
  value: currency,
}));

export const CurrencySelector = (props: CurrencySelectorProps) => {
  const { baseCurrency, onChange } = props;

  return <Selector options={currencyOptions} selectedOption={baseCurrency} onChange={onChange} />;
};
