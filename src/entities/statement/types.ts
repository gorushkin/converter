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
  inflow: number;
  outflow: number;
};

export type RawStatementDTO = Omit<StatementDTO, 'date' | 'id'> & {
  date: undefined;
  id: undefined;
};

export type RateUpdater = (date: string) => Promise<number>;

export type TableRow = Row;
