const generateRandomNumber = (): number => {
  return Math.random() * 100 + 1;
};

export const getRate = async (_date: string, _currency: string, _baseCurrency = 'rub'): Promise<number> =>
  Promise.resolve(generateRandomNumber());
