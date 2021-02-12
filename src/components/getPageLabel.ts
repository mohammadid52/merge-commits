export const getPageLabel = (index: any, pageArray: any[]) => {
  const idx = (typeof index === 'string') ? parseInt(index) : index;
  return pageArray[idx].stage;
}