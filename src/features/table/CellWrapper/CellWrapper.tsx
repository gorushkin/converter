import { observer } from 'mobx-react-lite';
import type { Cell, Row } from 'src/entities/row';

type CellWrapperProps<T> = {
  open: (props: { cell: Cell<T> }) => JSX.Element;
  closed: (props: { cell: Cell<T> }) => JSX.Element;
  row: Row;
  cell: Cell<T>;
};

export const CellWrapper = observer(<T,>(props: CellWrapperProps<T>) => {
  const { cell, closed, open, row } = props;

  const { isOpen } = row;

  const Component = isOpen ? open : closed;

  return <Component cell={cell} />;
});
