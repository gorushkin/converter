import { ColumnsType } from 'antd/es/table';
import type { Cell } from 'src/entities/row';
import type { TableRow } from 'src/entities/statement';
import { AmountInput } from 'src/features/Statement/AmountInput';
import { CellWrapper } from 'src/features/Statement/CellWrapper';
import { DateInput } from 'src/features/Statement/DateInput';
import { RateInput } from 'src/features/Statement/RateInput';
import { RenderCurrencyCell } from 'src/features/Statement/RenderCurrencyCell';
import { RenderTextCell } from 'src/features/Statement/RenderTextCell';
import { RowAction } from 'src/features/Statement/RowAction';

export const columns: ColumnsType<TableRow> = [
  {
    dataIndex: 'id',
    key: 'id',
    render: (_id, _row, index) => index + 1,
    title: '#',
  },
  {
    dataIndex: 'date',
    key: 'date',
    render: (_, row) => (
      <CellWrapper
        fieldname="date"
        renderClosed={(props) => <RenderTextCell {...props} />}
        renderEditable={(props) => <DateInput {...props} />}
        row={row}
      />
    ),
    title: 'Date',
  },
  {
    dataIndex: 'outflow',
    key: 'outflow',
    render: (_, row) => (
      <CellWrapper
        fieldname="outflow"
        renderClosed={(props) => <RenderCurrencyCell {...props} />}
        renderEditable={(props) => <AmountInput {...props} />}
        row={row}
      />
    ),
    title: 'Outflow',
  },
  {
    dataIndex: 'inflow',
    key: 'inflow',
    render: (_, row) => (
      <CellWrapper
        fieldname="inflow"
        renderClosed={(props) => <RenderCurrencyCell {...props} />}
        renderEditable={(props) => <AmountInput {...props} />}
        row={row}
      />
    ),
    title: 'Inflow',
  },
  {
    dataIndex: 'amountInBaseCurrency',
    key: 'amountInBaseCurrency',
    render: (cell: Cell<string>) => <RenderTextCell value={cell.value} />,
    title: 'amount',
  },
  {
    dataIndex: 'memo',
    key: 'memo',
    render: (_, row) => (
      <CellWrapper
        fieldname="memo"
        renderClosed={(props) => <RenderTextCell {...props} />}
        renderEditable={(props) => <AmountInput {...props} />}
        row={row}
      />
    ),
    title: 'Memo',
  },
  {
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
    render: (_, row) => (
      <CellWrapper
        fieldname="exchangeRate"
        renderClosed={(props) => <RenderCurrencyCell {...props} />}
        renderEditable={(props) => <RateInput {...props} />}
        row={row}
      />
    ),
    title: 'Rate',
  },
  {
    dataIndex: 'amountInTargetCurrency',
    key: 'amountInTargetCurrency',
    render: (_, row) => (
      <CellWrapper
        fieldname="amountInTargetCurrency"
        renderClosed={(props) => <RenderCurrencyCell {...props} />}
        row={row}
      />
    ),
    title: 'Target amount',
  },
  {
    dataIndex: 'action',
    key: 'action',
    render: (_, row) => <RowAction row={row} />,
    title: 'Actions',
  },
];
