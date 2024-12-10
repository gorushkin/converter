import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'; // ES 2015

dayjs.extend(customParseFormat);

const BASE_DATE_FORMAT = 'YYYY-MM-DD';
const BOG_DATE_FORMAT = 'DD/MM/YYYY';

export const getCurrentDate = (): string => dayjs().format(BASE_DATE_FORMAT);

const validateDate = (format: string) => (dateString: string) => dayjs(dateString, format, true).isValid();

const formatDate = (inputFormat: string) => (outputFormat: string) => (date: string) =>
  dayjs(date, inputFormat).format(outputFormat);

export const getInputFormatDate = (dateString: string) => formatDate(BASE_DATE_FORMAT)(BASE_DATE_FORMAT)(dateString);

export const validateUserDate = (dateString: string) => validateDate(BASE_DATE_FORMAT)(dateString);

export const numberToUICurrency = (number: number) =>
  number.toLocaleString('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

export const numberToCopyCurrency = (number: string) => number.replace('.', ',');

export const convertBogToBaseDate = formatDate(BOG_DATE_FORMAT)(BASE_DATE_FORMAT);
