export const parseBlankLines = (inputText: string) => {
  return inputText.replace(/(\n)+/g,'<br/>');
}