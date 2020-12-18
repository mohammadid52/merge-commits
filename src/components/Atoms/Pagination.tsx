import React, { useState, useEffect } from 'react';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: (c: number) => void;
}

interface PageArrowsProps {
  active: boolean;
  isBack?: boolean;
  extreme?: boolean;
  onClick: () => void;
}

const Active = (activeProps: { page: number, onClick: (c: number) => void }) => (
  <button onClick={() => activeProps.onClick(activeProps.page)} className='btn-indigo page-count ml-2'>
    {activeProps.page + 1}
  </button>
)

const Inactive = (InActiveProps: { page: number, onClick: (c: number) => void }) => (
  <button onClick={() => InActiveProps.onClick(InActiveProps.page)} className="btn-default-color page-count-default page-count">
    {InActiveProps.page + 1}
  </button>
)

const PageNo = (pageNoProps: { page: number, currentPage: number, onClick: (c: number) => void }) => {
  const { page, onClick, currentPage } = pageNoProps;
  if (page === currentPage) return <Active onClick={(e: number) => onClick(e)} page={page} />
  return <Inactive onClick={(e: number) => onClick(e)} page={page} />
}

const PageCount = (pageCountProps: { totalPages: number, currentPage: number, onClick: (c: number) => void }) => {
  const { totalPages, onClick, currentPage } = pageCountProps;

  const items = Array.from(Array(totalPages).keys());
  const [showNumbers, setShowNumbers] = useState(items);

  useEffect(() => {
    if (currentPage < totalPages - 1 && totalPages !== 1) {
      setShowNumbers([currentPage, currentPage + 1])
    } else if (totalPages === 1) {
      setShowNumbers([currentPage])
    } else {
      setShowNumbers([currentPage - 1, currentPage])
    }
  }, [currentPage, totalPages])

  return (
    <>
      {showNumbers.map((i, index) => (
        <PageNo
          onClick={(e: number) => onClick(e)}
          page={i}
          currentPage={currentPage}
          key={index}
        />
      ))}
    </>
  )
}

const PageArrows: React.FC<PageArrowsProps> = (pageProps: PageArrowsProps) => {
  const { active, onClick, extreme, isBack } = pageProps;

  return (
    <button onClick={onClick} className={`btn btn-default w-auto page-arrow ${isBack ? 'isBack' : ''} ${!active ? 'cursor-default' : ''}`} disabled={!active}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: active ? "black" : "darkgray" }}
        className={`breadcrumb-arrow text-default stroke-current inline-block h-4 w-4`}>
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
      {extreme &&
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: active ? "black" : "darkgray" }}
          className={`breadcrumb-arrow text-default stroke-current inline-block h-4 w-4`}>
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>}
    </button>
  )
}

const Pagination: React.FC<PaginationProps> = (pageProps: PaginationProps) => {
  const { currentPage, totalPages, setPage } = pageProps
  return (
    <div className="flex flex-wrap items-center justify-center children-x-2 pagination">

      <PageArrows onClick={() => setPage(0)} active={currentPage !== 0} extreme={true} isBack={true} />
      <PageArrows onClick={() => setPage(currentPage - 1)} active={currentPage !== 0} isBack={true} />
      {currentPage !== 0 && ('... ' + '   ')}

      <PageCount
        onClick={(e: number) => setPage(e)}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      {currentPage < (totalPages - 2) && ('   ' + ' ...')}
      <PageArrows onClick={() => setPage(currentPage + 1)} active={currentPage < (totalPages - 2)} />
      <PageArrows onClick={() => setPage(totalPages - 1)} active={currentPage < (totalPages - 2)} extreme={true} />
    </div>
  )
}

export default Pagination