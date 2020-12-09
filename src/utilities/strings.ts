interface PatternObject {
  [key: string]: string;
}

/**
 * Function to rearrange strings based on a pattern/separator
 * @param pattern
 * @param separator
 * @param inputPattern
 * @param outputPattern
 */
export const formatPattern = (pattern: string, separator: string, inputPattern: string, outputPattern: string) => {
  const patternStringObject = pattern.split(separator);
  const originalTime = inputPattern.split(separator).reduce((acc:PatternObject, val:string, i:number)=>{
    return {...acc, [`${val}`]:patternStringObject[i]}
  },{})
  const outputTime = outputPattern.split(separator).map((val: string, i: number) => originalTime[val])

  // console.log('formatpattern', patternStringObject);
  // console.log('formatpattern', originalTime);
  // console.log('formatpattern', outputTime);

  // The final; string
  return outputTime.join(separator);
}

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
