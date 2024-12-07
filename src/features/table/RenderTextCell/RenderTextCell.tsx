import { observer } from 'mobx-react-lite';
import { Cell } from 'src/entities/row';
import { RenderCell } from 'src/shared/ui/Cell';

type RenderTextCellProps<T> = {
  cell: Cell<T>;
};

export const RenderTextCell = observer(<T,>({ cell }: RenderTextCellProps<T>) => (
  <RenderCell value={cell.value} toCopyValue={cell.value} />
));
