import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { FaAngleRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  lastPage: boolean;
  firstPage: boolean;
  setNext: () => void;
  setPrev: () => void;
}

interface PageArrowsProps {
  active: boolean;
  isBack?: boolean;
  extreme?: boolean;
  onClick: () => void;
}

const Active = (activeProps: { page: number }) => (
  <button className='btn-indigo page-count ml-2 cursor-default'>
    {activeProps.page}
  </button>
)

const Inactive = (InActiveProps: { page: number }) => (
  <button className="btn-default-color page-count-default page-count cursor-default">
    {InActiveProps.page}
  </button>
)

const PageNo = (pageNoProps: { page: number, currentPage: number }) => {
  const { page, currentPage } = pageNoProps;
  if (page === currentPage) return <Active page={page} />
  return <Inactive page={page} />
}

const PageCount = (pageCountProps: { currentPage: number, lastPage: boolean, firstPage: boolean }) => {
  const { currentPage, lastPage, firstPage } = pageCountProps;
  const [showNumbers, setShowNumbers] = useState([]);

  useEffect(() => {
    if (currentPage !== 1 && currentPage !== 0) {
      setShowNumbers([currentPage - 1, currentPage])
    } else if ((currentPage == 1) && (firstPage && lastPage)) {
      setShowNumbers([currentPage])
    } else {
      setShowNumbers([currentPage, currentPage + 1])
    }
  }, [currentPage, firstPage, lastPage])

  return (
    <>
      {showNumbers.map((i, index) => (
        <PageNo
          page={i}
          currentPage={currentPage}
          key={index}
        />
      ))}
    </>
  )
}

const PageArrows: React.FC<PageArrowsProps> = (pageProps: PageArrowsProps) => {
  const { active, onClick, isBack } = pageProps;

  return (
    <button
      onClick={onClick}
      className={`btn btn-default w-20 page-arrow ${isBack ? 'isBack' : ''} ${!active ? 'cursor-default' : ''}`}
      disabled={!active}>
      <span className="w-6 mr-4 cursor-pointer">
        <IconContext.Provider value={{ size: '1.5rem', color: `${active ? '#667eea' : 'darkgrey'}` }}>
          <FaAngleRight />
        </IconContext.Provider>
      </span>
    </button>
  )
}

const Pagination: React.FC<PaginationProps> = (pageProps: PaginationProps) => {
  const { currentPage, lastPage, firstPage, setNext, setPrev } = pageProps
  return (
    <div className="flex flex-wrap items-center justify-center children-x-2 pagination">
      <PageArrows onClick={setPrev} active={currentPage !== 1} isBack={true} />
      <PageCount
        firstPage={firstPage}
        lastPage={lastPage}
        currentPage={currentPage}
      />
      <PageArrows onClick={setNext} active={!lastPage} />
    </div>
  )
}

export default Pagination