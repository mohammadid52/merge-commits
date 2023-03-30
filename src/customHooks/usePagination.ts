import {getQuery} from '@utilities/urls';
import {useEffect, useState} from 'react';

export interface ListBottomBar {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  goNextPage: () => void;
  setCurrentPage: (current: number) => void;
  goPrevPage: () => void;
  resetPagination: () => void;
  firstPage: boolean;
  lastPage: boolean;
  pageCount: number;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
}

const usePagination = (data: any[], totalResults: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [pageCount, setPageCount] = useState(Number(getQuery('pageSize')) || 10);
  const [currentList, setCurrentList] = useState<any[]>([]);

  const getIndex = (idx: number) => idx + 1 + pageCount * (currentPage - 1);

  const goNextPage = () => {};

  const goPrevPage = () => {};

  const resetPagination = () => {
    setCurrentPage(1);
    currentPageData();
  };

  const currentPageData = () => {
    const initialItem = (currentPage - 1) * pageCount;

    const updatedList = data.slice(initialItem, initialItem + pageCount) || [];

    setCurrentList(updatedList);
  };

  useEffect(() => {
    resetPagination();

    const totalListPages = Math.floor(totalResults / pageCount);
    if (pageCount * totalListPages === totalResults) {
      setTotalPages(totalListPages);
    } else {
      setTotalPages(totalListPages + 1);
    }
  }, [pageCount]);

  useEffect(() => {
    if (data.length > 0) {
      currentPageData();
    }
  }, [currentPage, totalResults, pageCount, data.length]);

  const allAsProps: ListBottomBar = {
    totalPages,
    totalResults,
    pageCount,
    currentPage,
    goNextPage,
    goPrevPage,
    firstPage,
    lastPage,
    setPageCount,
    resetPagination,
    setCurrentPage
  };

  return {
    goNextPage,
    goPrevPage,
    resetPagination,
    pageCount,
    setPageCount,
    setTotalPages,
    setCurrentPage,
    totalPages,
    allAsProps,
    setFirstPage,
    setLastPage,
    setCurrentList,
    lastPage,
    firstPage,
    currentList,
    getIndex,
    currentPage
  };
};

export default usePagination;
