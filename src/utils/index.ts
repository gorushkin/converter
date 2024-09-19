import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'; // ES 2015

dayjs.extend(customParseFormat);

const INPUT_DATE_FORMAT = 'YYYY-MM-DD';
const USER_DATE_FORMAT_SHORT = 'DD/MM/YY';
const USER_DATE_FORMAT_LONG = 'DD/MM/YYYY';

export const getCurrentDate = (): string => dayjs().format(INPUT_DATE_FORMAT);

const validateDate = (format: string) => (dateString: string) => dayjs(dateString, format, true).isValid();

const formatDate = (inputFormat: string) => (outputFormat: string) => (date: string) =>
  dayjs(date, inputFormat).format(outputFormat);

export const getInputFormatDate = (dateString: string) =>
  formatDate(USER_DATE_FORMAT_SHORT)(INPUT_DATE_FORMAT)(dateString);

export const validateUserDate = (dateString: string) =>
  validateDate(USER_DATE_FORMAT_SHORT)(dateString) || validateDate(USER_DATE_FORMAT_LONG)(dateString);
