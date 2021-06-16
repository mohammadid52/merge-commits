export const replaceTailwindClass = (inputString: string, replacementValue: string) => {
  if (inputString.includes('bg-') && replacementValue.includes('bg-')) {
    return inputString.replace(/((?<!:)bg-\w+-\d+)/, replacementValue);
  } else {
    return `${inputString} ${replacementValue}`;
  }
};
