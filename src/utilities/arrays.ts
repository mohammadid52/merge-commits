/**
 * Function that accepts an array of flat-objects,
 * will return an array of only the unique values based
 * on the property param
 * @param arrOfObjects
 * @param property
 */
export const getArrayOfUniqueValueByProperty = (arrOfObjects: any[], property: string): string[] => {
  return arrOfObjects.reduce((acc: string[], obj: any) => {
    if (obj.hasOwnProperty(property)) {
      if (!acc.includes(obj[property])) {
        return [...acc, obj[property]];
      } else {
        return acc;
      }
    } else {
      return acc;
    }
  }, []);
};

export const removeFromArray = (arr: any, target: any) => {
  return arr.filter((item: any) => item !== target);
}
