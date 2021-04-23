

export const goBackBreadCrumb = (list:any[],history: any) => {
    const lastSecondIdx = list.length - 2;
    const url = list[lastSecondIdx]?.url;
    if (url) {
      history.push(url);
    } else {
      history.goBack();
    }
  };