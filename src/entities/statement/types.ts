import type { Row, RowDTO } from 'src/entities/row';
import type { Currency } from 'src/shared/types';

export type StatementDTO = {
  name: string;
  date: string;
  id: string;
  targetCurrency: Currency;
  baseCurrency: Currency;
  row: RowDTO[];
  startBalance: number;
  endBalance: number;
};

export type RawStatementDTO = Omit<StatementDTO, 'date' | 'id'> & {
  date: undefined;
  id: undefined;
};

export type RateUpdater = (date: string) => Promise<number | null>;

export type TotalRow = {
  amount: number;
  amountInTargetCurrency: number;
  inflow: number;
  outflow: number;
  id: string;
  type: 'total';
};

export type TableRow = Row | TotalRow;
