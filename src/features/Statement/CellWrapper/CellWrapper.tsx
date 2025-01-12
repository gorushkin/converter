import { observer } from 'mobx-react-lite';
import type { Cell, Row } from 'src/entities/row';
import { statementsStore } from 'src/entities/statements/statements';

type CellWrapperProps<T> = {
  renderEditable?: (props: { cell: Cell<T> }) => JSX.Element;
  renderClosed: (props: { value: string }) => JSX.Element;
  row: Row;
  fieldname: keyof Row;
};

export const CellWrapper = observer(<T,>(props: CellWrapperProps<T>) => {
  const { fieldname, renderClosed, renderEditable, row } = props;

  const { currentStatement } = statementsStore;
  const { currentRow } = currentStatement;

  const editableCell = currentRow?.[fieldname] as Cell<T>;

  const cell = row[fieldname] as Cell<T>;
  const cellValue = cell.value;

  if (row.isOpen && renderEditable) {
    return renderEditable({ cell: editableCell });
  }

  return renderClosed({ value: cellValue });
});
