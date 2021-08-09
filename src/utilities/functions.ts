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
