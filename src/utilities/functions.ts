export const goBackBreadCrumb = (list: any[], history: any) => {
  const lastSecondIdx = list.length - 2;
  const url = list[lastSecondIdx]?.url;
  if (url) {
    history.push(url);
  } else {
    history.goBack();
  }
};

export const doResize = (textbox: any) => {
  var maxrows = 50;
  var txt = textbox.value;
  var cols = textbox.cols;

  var arraytxt: any = txt.split('\n');
  var rows = arraytxt.length;

  for (let i = 0; i < arraytxt.length; i++)
    // @ts-ignore
    rows += parseInt(arraytxt[i].length / cols);

  if (rows > maxrows) textbox.rows = maxrows;
  else textbox.rows = rows;
};
export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const capitalizeFirstLetter = (str: string = '') => {
  if (str.length > 0) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }
};

export const removeExtension = (filename: string) => {
  const lastDotPosition = filename.lastIndexOf('.');
  if (lastDotPosition === -1) return filename;
  else return filename.substr(0, lastDotPosition);
};

export const ellipsis = (text: string, len: number): string => {
  if (text) {
    if (text.length <= len) {
      return text;
    } else {
      return `${text.substring(0, len)}...`;
    }
  }
};

export const randomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export  const getJSON = async(url:string):Promise<string> =>{
  const response = await fetch(url);
  return await response.json();
}