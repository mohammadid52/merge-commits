export const replaceTailwindClass = (inputString: string, replacementValue: string) => {
  if (inputString?.includes('bg-') && replacementValue.includes('bg-')) {
    return inputString.replace(/((?<!:)bg-\w+-\d+)/, replacementValue);
  } else if (inputString?.includes('border-') && replacementValue.includes('border-')) {
    return inputString.replace(/((?<!:)border-\w\w+-\d+)/, replacementValue);
  } else if (inputString?.includes('grid-') && replacementValue.includes('grid-')) {
    return inputString.replace(/((?<!:)grid-\w+-\d+)/, replacementValue);
  } else if (inputString ?.includes('text-') && replacementValue.includes('text-')) {
    return inputString.replace(/((?<!:)text-\w+)/, replacementValue);
  } else {
    return `${inputString||""} ${replacementValue}`;
  }
};
