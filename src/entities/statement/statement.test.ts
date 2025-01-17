import { expect, test, describe, beforeEach } from 'vitest';
import { vi } from 'vitest';

import { Statement } from './statement';

const statement = new Statement();

const rowValues = {
  amountInBaseCurrency: '100',
  amountInTargetCurrency: '0',
  date: '2022-01-01',
  exchangeRate: '0',
  id: 'mocked-id',
  inflow: '100',
  isClear: false,
  memo: '',
  outflow: '0',
  payee: '',
  runningBalance: '0',
};

vi.mock('src/utils/getId', () => ({
  getId: vi.fn(() => rowValues.id),
}));

function getRandomDate() {
  const startYear = 2000;
  const endYear = 2025;
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // Случайный месяц (01-12)
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // Случайный день (01-28)
  return `${year}-${month}-${day}`;
}

const dates = Array.from({ length: 20 }, getRandomDate);

const shuffledDates = dates.sort(() => Math.random() - 0.5);

const expectedDates = dates.sort((a, b) => b.localeCompare(a)).join(', ');

beforeEach(() => {
  statement.reset();
});

describe('Statement', () => {
  test('adding new row', () => {
    statement.addRow();
    statement.currentRow?.date.setValue(rowValues.date);
    statement.currentRow?.inflow.setValue(rowValues.inflow);
    statement.saveRow();

    expect(statement.rows.length).toEqual(1);
    expect(statement.rows[0].id).toEqual(rowValues.id);
    expect(statement.rows[0].values.date).toEqual(rowValues.date);
  });

  test('adding rows in random order with proper sorting', () => {
    for (const date of shuffledDates) {
      statement.addRow();
      statement.currentRow?.date.setValue(date);
      statement.saveRow();
    }

    const rowsString = statement.rows.map((row) => row.values.date).join(', ');

    expect(rowsString).toEqual(expectedDates);
  });
});
