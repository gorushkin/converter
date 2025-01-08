import { makeAutoObservable } from 'mobx';
import { Bank, Currency } from 'src/shared/types';
import { BogBusinessParser, VakifParser, BogRetailParser, TbcBusinessParser, DeelParser } from 'src/utils/parsers';
import { settingStorage } from 'src/utils/storage';

const parserMapper: Record<
  Bank,
  typeof VakifParser | typeof BogBusinessParser | typeof BogRetailParser | typeof TbcBusinessParser | typeof DeelParser
> = {
  [Bank.BOGBusiness]: BogBusinessParser,
  [Bank.BOGRetail]: BogRetailParser,
  [Bank.DEEL]: DeelParser,
  [Bank.TBCBusiness]: TbcBusinessParser,
  [Bank.VAKIF]: VakifParser,
};

export type SettingsDTO = { bank: Bank; baseCurrency: Currency };

class Settings {
  private storage = settingStorage;
  private bank: Bank;
  private baseCurrency: Currency;

  private fileFormat: 'xlsx' | 'csv' = 'csv';

  constructor(public isOpen = false) {
    this.bank = this.storage.getBank();
    this.baseCurrency = this.storage.getBaseCurrency();

    makeAutoObservable(this);
  }

  setBank = (bank: Bank) => {
    this.bank = bank;
    this.storage.setBank(bank);
  };

  setBaseCurrency = (currency: Currency) => {
    this.baseCurrency = currency;
    this.storage.setBaseCurrency(currency);
  };

  toggle = () => {
    this.isOpen = !this.isOpen;
  };

  get isCSV() {
    return this.fileFormat === 'csv';
  }

  get isXLSX() {
    return this.fileFormat === 'xlsx';
  }

  get parser(): VakifParser | BogBusinessParser | BogRetailParser | TbcBusinessParser | DeelParser {
    return new parserMapper[this.bank](this.bank, this.baseCurrency, Currency.RUB);
  }
}

export const settings = new Settings();
