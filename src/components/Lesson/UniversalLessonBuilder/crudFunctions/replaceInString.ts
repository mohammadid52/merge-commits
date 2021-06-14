export const replaceTailwindClass = (inputString: string, replacementValue: string) => {
  if (inputString?.includes('bg-') && replacementValue.includes('bg-')) {
    return inputString.replace(/((?<!:)bg-\w+-\d+)/, replacementValue);
  } else if (inputString ?.includes('grid-') && replacementValue.includes('grid-')) {
    return inputString.replace(/((?<!:)grid-\w+-\d+)/, replacementValue);
  } else {
    return `${inputString||""} ${replacementValue}`;
  }
};
