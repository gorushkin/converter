import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Bank, getBankName, ImportTransactionDTO, type Currency } from 'src/shared/types';
import * as XLSX from 'xlsx';

import { convertVakifToBaseDate, getISODate } from './formatters';

type Balance = {
  startBalance: number;
  endBalance: number;
};

type VakifTransactionDTO = {
  'ACCOUNT NUMBER': string;
  'RECEIPT NUMBER': number;
  'TRANSACTION DATE': string;
  'PROCESS DATE': string;
  'CARD NUMBER': string;
  'TRANSACTION  NAME': string;
  AMOUNT: number;
  BALANCE: number;
  CHANNEL: string;
  REFNO: string;
  'TRANSACTION ID': string;
  'IDENTIFICATION NUMBER': string;
  'TAX NUMBER': string;
  'D/C': string;
  NARRATIVE: string;
};

class VakifParser {
  rawData: ArrayBuffer | null = null;
  bank: Bank = Bank.VAKIF;
  private transactionSheetName = 'Sheet1';
  private headerRowIndex = 6;
  private transactionLastRowIndex = 4;
  private baseCurrency: Currency = 'TRY';
  private targetCurrency: Currency = 'RUB';
  balance: Balance = {
    endBalance: 0,
    startBalance: 0,
  };

  getData = (buffer: ArrayBuffer): null | StatementDTO => {
    const workbook = this.parseData(buffer);

    const clearData = this.findData(workbook);

    const convertedData = this.prepareData(clearData);

    return this.convertData(convertedData);
  };

  parseData = (buffer: ArrayBuffer) => {
    const data = new Uint8Array(buffer);
    return XLSX.read(data, { type: 'array' });
  };

  findData = (workbook: XLSX.WorkBook | null): VakifTransactionDTO[] => {
    if (!workbook) {
      throw new Error('Workbook is not defined');
    }

    const sheet = workbook.Sheets[this.transactionSheetName];

    const jsonData = XLSX.utils
      .sheet_to_json(sheet, {
        header: this.headerRowIndex,
        range: this.headerRowIndex,
      })
      .slice(0, -this.transactionLastRowIndex) as VakifTransactionDTO[];

    this.updateBalance(jsonData);

    return jsonData;
  };

  updateBalance = (rows: VakifTransactionDTO[]) => {
    if (!rows.length) {
      return;
    }

    const startBalance = rows[0].BALANCE - rows[0].AMOUNT;
    const endBalance = rows[rows.length - 1].BALANCE;

    this.balance = {
      endBalance,
      startBalance,
    };
  };

  convertData = (data: ImportTransactionDTO[]): StatementDTO | null => {
    const rows: RowDTO[] = data.map((item, id) => {
      const inflow = item.amount > 0 ? String(item.amount) : '';
      const outflow = item.amount < 0 ? String(Math.abs(item.amount)) : '';

      return {
        ...item,
        amountInBaseCurrency: String(item.amount),
        amountInTargetCurrency: '0',
        exchangeRate: '0',
        id: String(id),
        inflow,
        outflow,
      };
    });

    const name = `${getBankName(this.bank)} ${getISODate()}`;

    return {
      baseCurrency: this.baseCurrency,
      date: new Date().toISOString(),
      id: '',
      name,
      row: rows,
      targetCurrency: this.targetCurrency,
      ...this.balance,
    };
  };

  prepareData = (data: VakifTransactionDTO[]): ImportTransactionDTO[] => {
    const updatedData: ImportTransactionDTO[] = data.map((item) => {
      return {
        amount: item.AMOUNT ?? 0,
        date: convertVakifToBaseDate(item['TRANSACTION DATE'] ?? ''),
        memo: item.NARRATIVE ?? '',
        payee: '',
      };
    });

    return updatedData;
  };
}

export const vakifParser = new VakifParser();
