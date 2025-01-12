import { observer } from 'mobx-react-lite';
import { RenderCell } from 'src/shared/ui/Cell';
import { numberToCopyCurrency, numberToUICurrency } from 'src/utils';

type RenderCurrencyCellProps = {
  value: string;
};

export const RenderCurrencyCell = observer(({ value }: RenderCurrencyCellProps) => {
  const formattedNumber = numberToUICurrency(Number(value));

  return <RenderCell value={formattedNumber} toCopyValue={numberToCopyCurrency(value)} />;
});
