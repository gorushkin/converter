import type { RowDTO } from 'src/entities/row';
import type { StatementDTO } from 'src/entities/statement';
import { Bank, ImportTransactionDTO } from 'src/shared/types';
import * as XLSX from 'xlsx';

type VakifTransactionDTO = {
  'ACCOUNT NUMBER': string;
  'RECEIPT NUMBER'?: number;
  'TRANSACTION DATE'?: string;
  'PROCESS DATE'?: string;
  'CARD NUMBER'?: string;
  'TRANSACTION  NAME'?: string;
  AMOUNT?: number;
  BALANCE?: number;
  CHANNEL?: string;
  REFNO?: string;
  'TRANSACTION ID'?: string;
  'IDENTIFICATION NUMBER'?: string;
  'TAX NUMBER'?: string;
  'D/C'?: string;
  NARRATIVE?: string;
};

class VakifParser {
  rawData: ArrayBuffer | null = null;
  workbook: XLSX.WorkBook | null = null;
  bank: Bank | null = Bank.VAKIF;
  private transactionSheetName = 'Sheet1';
  private headerRowIndex = 6;
  private transactionLastRowIndex = 4;

  parseData = (buffer: ArrayBuffer) => {
    const data = new Uint8Array(buffer);
    return XLSX.read(data, { type: 'array' });
  };

  getData = (buffer: ArrayBuffer): null | StatementDTO => {
    const workbook = this.parseData(buffer);

    console.log('workbook: ', workbook);

    this.workbook = workbook;

    const convertedData = this.convertData();

    if (!convertedData) {
      return null;
    }

    return this.updateDate(convertedData);
  };

  updateDate = (data: ImportTransactionDTO[]): StatementDTO | null => {
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

    return {
      baseCurrency: 'GEL',
      date: new Date().toISOString(),
      id: '',
      name: 'BOG',
      row: rows,
      targetCurrency: 'RUB',
    };
  };

  convertData = (): null | ImportTransactionDTO[] => {
    if (!this.workbook) {
      return null;
    }

    const sheet = this.workbook.Sheets[this.transactionSheetName];
    const jsonData: unknown[] = XLSX.utils
      .sheet_to_json(sheet, {
        header: this.headerRowIndex,
        range: this.headerRowIndex,
      })
      .slice(0, -this.transactionLastRowIndex);
    const date = jsonData;
    console.log('date: ', date);
    // console.log(JSON.stringify(date));

    const jsonDataWithoutEmptyRows = jsonData.filter((item) => item.Date !== 'Balance');

    const results: ImportTransactionDTO[] = jsonDataWithoutEmptyRows.reduce<ImportTransactionDTO[]>((acc, item) => {
      return acc;
    }, []);

    return results;
  };
}

export const vakifParser = new VakifParser();
