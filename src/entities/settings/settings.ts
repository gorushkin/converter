import { makeAutoObservable } from 'mobx';
import { Bank, Currency } from 'src/shared/types';
import { Parser, VakifParser, bogBusinessParser, bogRetailParser } from 'src/utils/parsers';
import { settingStorage } from 'src/utils/storage';

const parserMapper: Record<Bank, typeof VakifParser | typeof bogRetailParser | typeof bogBusinessParser> = {
  [Bank.BOGBusiness]: bogBusinessParser,
  [Bank.BOGRetail]: bogRetailParser,
  [Bank.TBC]: VakifParser,
  [Bank.VAKIF]: VakifParser,
};

export type SettingsDTO = { bank: Bank; baseCurrency: Currency };

class Settings {
  private storage = settingStorage;
  private bank: Bank;
  private baseCurrency: Currency;

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

  get parser(): Parser<unknown, unknown> {
    return new parserMapper[this.bank](this.bank, this.baseCurrency, Currency.RUB);
  }
}

export const settings = new Settings();
