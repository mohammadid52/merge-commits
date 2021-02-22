import React, { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContext';

interface CountProps {
  pageSize: number;
  setPageSize: (c: number) => void;
}
const PageCountSelector: React.FC<CountProps> = (countProps: CountProps) => {
  const { pageSize, setPageSize } = countProps;
  const { theme } = useContext(GlobalContext);

  return (
    <select
      className={`text-sm ${theme.formSelect} ${theme.outlineNone} w-auto py-3 px-4 my-5 rounded`}
      value={pageSize}
      onChange={e => {
        setPageSize(Number(e.target.value))
      }}>
      {[10, 25, 50, 100].map(pageSize => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
    </select>
  )
}

export default PageCountSelector;
