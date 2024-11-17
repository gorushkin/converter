import type { RowDTO } from 'src/entities/row';
import type { Currency } from 'src/shared/types';

export type StatementDTO = {
  name: string;
  date: string;
  id: string;
  targetCurrency: Currency;
  baseCurrency: Currency;
  row: RowDTO[];
};

export type RawStatementDTO = Omit<StatementDTO, 'date' | 'id'> & {
  date: undefined;
  id: undefined;
};

export type RateUpdater = (date: string) => Promise<number | null>;
