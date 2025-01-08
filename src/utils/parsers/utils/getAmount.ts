import { parseNumber } from 'src/utils/formatters';

export const getAmount = (inflow?: string, outflow?: string) => {
  if (outflow) {
    return -parseNumber(outflow);
  }

  if (inflow) {
    return parseNumber(inflow);
  }

  return 0;
};
