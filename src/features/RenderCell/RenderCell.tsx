import { observer } from 'mobx-react-lite';
import { Cell } from 'src/store';

type RenderCellProps<T> = {
  cell: Cell<T>;
};

export const RenderCell = observer(<T,>({ cell }: RenderCellProps<T>) => <div>{String(cell.value)}</div>);
