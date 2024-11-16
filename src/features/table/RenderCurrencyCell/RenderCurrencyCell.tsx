import { observer } from 'mobx-react-lite';
import { Cell } from 'src/entities/row';
import { RenderCell } from 'src/shared/ui/Cell';
import { numberToCopyCurrency, numberToUICurrency } from 'src/utils';

type RenderCurrencyCellProps<T> = {
  cell: Cell<T>;
};

export const RenderCurrencyCell = observer(<T,>({ cell }: RenderCurrencyCellProps<T>) => {
  const formattedNumber = numberToUICurrency(Number(cell.value));

  return <RenderCell value={formattedNumber} toCopyValue={numberToCopyCurrency(cell.value)} />;
});
