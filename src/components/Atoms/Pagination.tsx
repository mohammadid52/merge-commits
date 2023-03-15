import React, {useEffect, useState} from 'react';
import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri';
import Buttons from './Buttons';

interface PaginationProps {
  currentPage: number;
  lastPage: boolean;
  firstPage: boolean;
  setNext: () => void;
  setPrev: () => void;
  totalPages?: number;
}

interface PageArrowsProps {
  active: boolean;
  isBack?: boolean;
  extreme?: boolean;
  onClick: () => void;
}

const Active = (activeProps: {page: number}) => {
  return (
    <button
      className={`inline-flex w-auto transition-all items-center border-t-2 theme-border:500 px-4 pt-4 text-sm font-medium theme-text:600`}>
      {activeProps.page}
    </button>
  );
};

const Inactive = (InActiveProps: {
  page: number;
  currentPage: number;
  setNext: () => void;
  setPrev: () => void;
}) => {
  const {currentPage, setNext, setPrev, page} = InActiveProps;

  return (
    <button
      onClick={currentPage < page ? setNext : setPrev}
      className="inline-flex w-auto transition-all items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
      {page}
    </button>
  );
};

const PageNo = (pageNoProps: {
  page: number;
  currentPage: number;
  setNext: () => void;
  setPrev: () => void;
}) => {
  const {page, currentPage, setNext, setPrev} = pageNoProps;

  return (
    <>
      {page === currentPage && <Active page={page} />}

      {page !== currentPage && (
        <Inactive
          page={page}
          currentPage={currentPage}
          setPrev={setPrev}
          setNext={setNext}
        />
      )}
    </>
  );
};

const PageCount = (pageCountProps: {
  currentPage: number;
  lastPage: boolean;
  firstPage: boolean;
  setNext: () => void;
  setPrev: () => void;
}) => {
  const {currentPage, lastPage, firstPage, setNext, setPrev} = pageCountProps;
  const [showNumbers, setShowNumbers] = useState<any[]>([]);

  useEffect(() => {
    if (currentPage !== 1 && currentPage !== 0) {
      setShowNumbers([currentPage - 1, currentPage]);
    } else if (currentPage == 1 && firstPage && lastPage) {
      setShowNumbers([currentPage]);
    } else if (currentPage === 0) {
      setShowNumbers([currentPage + 1]);
    } else {
      setShowNumbers([currentPage, currentPage + 1]);
    }
  }, [currentPage, firstPage, lastPage]);

  return (
    <>
      {showNumbers.map((i, index) => (
        <PageNo
          page={i}
          setPrev={setPrev}
          setNext={setNext}
          currentPage={currentPage}
          key={index}
        />
      ))}
    </>
  );
};

const PageArrows: React.FC<PageArrowsProps> = (pageProps: PageArrowsProps) => {
  const {active, onClick, isBack} = pageProps;

  return (
    <Buttons
      Icon={isBack ? RiArrowLeftSLine : RiArrowRightSLine}
      transparent
      size="small"
      btnClass="mt-4"
      onClick={onClick}
      iconSize="w-4 h-6"
      disabled={!active}
    />
  );
};

const Dots = () => (
  <span className="inline-flex w-auto items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
    ...
  </span>
);

const Pagination: React.FC<PaginationProps> = (pageProps: PaginationProps) => {
  const {currentPage, lastPage, firstPage, setNext, setPrev} = pageProps;

  return (
    <div className="flex gap-x-4  flex-wrap items-center w-full lg:w-1/3 justify-center">
      <PageArrows onClick={setPrev} active={currentPage !== 1} isBack={true} />
      {currentPage !== 1 && <Dots />}
      <PageCount
        setPrev={setPrev}
        setNext={setNext}
        firstPage={firstPage}
        lastPage={lastPage}
        currentPage={currentPage}
      />
      {!lastPage && <Dots />}
      <PageArrows onClick={setNext} active={!lastPage} />
    </div>
  );
};

export default Pagination;
