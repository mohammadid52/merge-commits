/**
 * Parses linebreak characters \n and 
 * replaces them with a html break <br>
 * @param inputText 
 */
export const parseBlankLines = (inputText: string) => {
  if(typeof inputText !== 'undefined'){
    return inputText.replace(/(\n)+/g,'<br/>');
  } else {
    return 'No input text...'
  }
}

/**
 * Returns text as lowercase
 * @param inputText 
 */
export const lc = (inputText: string): string => {
  return inputText.toLowerCase();
}

/**
 * Function used in multiple places to
 * capitalize the first letter of a word
 * @param str 
 */
export const firstInitialFunc = (str: string) => {
  if (typeof str !== 'string' || str === '') { return 'Profile' }
  let firstInitial = str.charAt(0)
  firstInitial = firstInitial.toUpperCase() + '.';
  return firstInitial;
}
