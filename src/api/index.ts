import axios from 'axios';

export type Rates = Record<string, number>;

export type RatesInfo = {
  rates: Rates;
  base: string;
  date: string;
};

export type Response<T> = { ok: true; data: T } | { ok: false; error: string };

const BASE_URL = import.meta.env.VITE_BASE_URL;

export class ApiClient {
  private url = `${BASE_URL}cbrf?date=`;

  fetchCurrencyRate = async (date: string): Promise<Response<RatesInfo>> => {
    try {
      const { data } = await axios<RatesInfo>(`${this.url}${date}`);
      return { data, ok: true };
    } catch (error) {
      console.error('Error fetching CBRF rate', error);
      return { error: 'Something went wrong', ok: false };
    }
  };
}
