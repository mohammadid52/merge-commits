import PageCountSelector from '@components/Atoms/PageCountSelector';
import Pagination from '@components/Atoms/Pagination';
import React from 'react';

export interface ListBottomBar {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  goNextPage: () => void;
  goPrevPage: () => void;
  resetPagination: () => void;
  firstPage: boolean;
  lastPage: boolean;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
}

const ListBottomBar = ({
  totalResults,
  currentPage,
  goNextPage,
  goPrevPage,
  firstPage,
  resetPagination,
  lastPage,
  pageCount,
  setPageCount
}: ListBottomBar) => {
  return (
    <div className="flex justify-center  bg-white my-4">
      <div className="flex justify-between items-center  flex-col lg:flex-row">
        <div className="w-auto">
          <p className="text-sm text-gray-700">
            Showing
            <span className="font-medium ml-1">
              {currentPage === 0 ? currentPage + 1 : pageCount * currentPage + 1}
            </span>
            <span className="ml-1">to</span>
            <span className="font-medium ml-1">
              {lastPage
                ? totalResults
                : currentPage === 0
                ? pageCount * 1
                : pageCount * currentPage + pageCount}
            </span>
            <span className="ml-1">of</span>
            <span className="font-medium ml-1">{totalResults}</span>
            <span className="ml-1">results</span>
          </p>
        </div>
        <Pagination
          currentPage={currentPage + 1}
          setNext={goNextPage}
          setPrev={goPrevPage}
          firstPage={firstPage}
          lastPage={lastPage}
        />
        <PageCountSelector
          totalResults={totalResults}
          pageSize={pageCount}
          setPageSize={(c: number) => {
            resetPagination();
            setPageCount(c);
          }}
        />
      </div>
    </div>
  );
};

export default ListBottomBar;
