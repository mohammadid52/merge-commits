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
    <div className="flex justify-center bg-white my-4">
      <div className="flex justify-between items-center gap-4 w-full  flex-col sm:flex-row">
        <div className="hidden sm:block sm:w-1/3"></div>
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
