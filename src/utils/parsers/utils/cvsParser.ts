type EndLine = '\r\n' | '\n';

type Params = {
  header?: number;
  start?: number;
  end?: number;
  endLine?: EndLine;
};

const parseLine = (line: string): string[] => {
  const result: string[] = [];

  let curr = '';
  let isOpen = false;
  let shouldBeTrimmed = false;

  for (const char of line) {
    if (char === '"') {
      if (!isOpen) {
        shouldBeTrimmed = true;
      }
      isOpen = !isOpen;
    }

    if (char === ',' && !isOpen) {
      const updatedCurr = shouldBeTrimmed ? curr.slice(1, -1) : curr;
      shouldBeTrimmed = false;

      result.push(updatedCurr);
      curr = '';
      continue;
    }

    curr += char;
  }

  return result;
};

export const parseVCS = <T>(data: string, params: Params): T[] => {
  const { end, endLine = '\n', header = 0, start = 0 } = params;

  const lines = data.trim().split(endLine);

  const [headersLine] = lines.slice(header, header + 1).map((item) => item.split(','));

  const result = lines.slice(start, end ?? lines.length - 1).map((item) => {
    const line = parseLine(item);

    return line.reduce<T>((acc, item, index) => {
      const key = headersLine[index];

      return {
        ...acc,
        [key]: item,
      };
    }, {} as T);
  });

  return result;
};
