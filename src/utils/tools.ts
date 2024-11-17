export const updateClipboard = (text: string) => {
  void navigator.clipboard.writeText(text);
};

export const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');
