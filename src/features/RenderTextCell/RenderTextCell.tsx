import { observer } from 'mobx-react-lite';
import { RenderCell } from 'src/shared/Cell';
import { Cell } from 'src/store';

type RenderTextCellProps<T> = {
  cell: Cell<T>;
};

export const RenderTextCell = observer(<T,>({ cell }: RenderTextCellProps<T>) => (
  <RenderCell value={cell.value} toCopyValue={cell.value} />
));
