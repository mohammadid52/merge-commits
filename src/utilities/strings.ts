export const parseBlankLines = (inputText: string) => {
  if(typeof inputText !== 'undefined'){
    return inputText.replace(/(\n)+/g,'<br/>');
  } else {
    return 'No input text...'
  }
}