export const updateClipboard = (text: string) => {
  void navigator.clipboard.writeText(text);
};
