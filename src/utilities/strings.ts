export const parseBlankLines = (inputText: string) => {
  if(typeof inputText !== 'undefined'){
    return inputText.replace(/(\n)+/g,'<br/>');
  } else {
    return 'No input text...'
  }
}

export const lc = (inputText: string): string => {
  return inputText.toLowerCase();
}

export const firstInitialFunc = (str: string) => {
  if (typeof str !== 'string' || str === '') { return 'Profile' }
  let firstInitial = str.charAt(0)
  firstInitial = firstInitial.toUpperCase() + '.';
  return firstInitial;
}