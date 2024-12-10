import { observer } from 'mobx-react-lite';
import type { Cell, Row } from 'src/entities/row';
import type { TableRow, TotalRow } from 'src/entities/statement/';
import { RenderCell } from 'src/shared/ui/Cell';
import { checkIsTotal } from 'src/shared/utils/validators';
import { numberToCopyCurrency } from 'src/utils';

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

type BaseCellWrapperProps = {
  row: TableRow;
  property?: keyof TotalRow;
  children: (row: Row) => React.ReactNode;
};

export const BaseCellWrapper = observer(({ children, property, row }: BaseCellWrapperProps) => {
  const isTotal = checkIsTotal(row);

  if (isTotal) {
    const value = row[property!];
    const convertedValue = numberToCopyCurrency(String(value));
    const valueToRender = property ? convertedValue : '';

    return <RenderCell value={valueToRender} toCopyValue={valueToRender} />;
  }

  return children(row);
});
