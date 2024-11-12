import { observer } from 'mobx-react-lite';
import { RenderCell } from 'src/shared/Cell';
import { Cell } from 'src/store';
import { numberToCopyCurrency, numberToUICurrency } from 'src/utils';

type RenderCurrencyCellProps<T> = {
  cell: Cell<T>;
};

export const RenderCurrencyCell = observer(<T,>({ cell }: RenderCurrencyCellProps<T>) => {
  const formattedNumber = numberToUICurrency(Number(cell.value));

  return <RenderCell value={formattedNumber} toCopyValue={numberToCopyCurrency(cell.value)} />;
});
