import React from 'react';

interface IShowingCount {
  totalResults: number;
  currentPage: number;
  lastPage: boolean;
  pageCount: number;
}

const ShowingCount = ({
  currentPage,
  pageCount,
  lastPage,
  totalResults
}: IShowingCount) => {
  return (
    <div className="w-auto flex items-center justify-end">
      <p className="text-sm w-auto text-gray-700">
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
  );
};

export default ShowingCount;
