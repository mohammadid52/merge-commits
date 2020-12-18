import React from 'react'

interface CountProps {
  pageSize: number;
  setPageSize: (c: number) => void;
}
const pageCountSelector: React.FC<CountProps> = (countProps: CountProps) => {
  const { pageSize, setPageSize } = countProps;
  return (
    <select
      className="form-select text-sm"
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

export default pageCountSelector
