import {ListBottomBar} from '@components/Molecules/ListBottomBar';
import {useEffect, useState} from 'react';

const usePagination = (data: any[], totalResults: number) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [pageCount, setPageCount] = useState(10);
  const [currentList, setCurrentList] = useState([]);

  const goNextPage = () => {
    const pageHigherLimit = totalPages - 1;
    if (firstPage) {
      setFirstPage(false);
    }
    if (currentPage === pageHigherLimit - 1) {
      setLastPage(true);
    }
    setCurrentPage(currentPage + 1);
  };

  const goPrevPage = () => {
    if (lastPage) {
      setLastPage(false);
    }
    if (currentPage > 0) setCurrentPage(currentPage - 1);
    else {
      setFirstPage(true);
    }
  };

  const resetPagination = () => {
    setCurrentPage(0);
    currentPageData();
    setFirstPage(true);
    if (totalPages === 1) {
      setLastPage(true);
    } else {
      setLastPage(false);
    }
  };

  const currentPageData = () => {
    const initialItem = currentPage * pageCount;
    const updatedList = data.slice(initialItem, initialItem + pageCount);
    setCurrentList(updatedList);
  };

  useEffect(() => {
    setCurrentPage(0);
    setFirstPage(true);
    setLastPage(false);
    const totalListPages = Math.floor(totalResults / pageCount);
    if (pageCount * totalListPages === totalResults) {
      setTotalPages(totalListPages);
    } else {
      setTotalPages(totalListPages + 1);
    }
    if (totalPages === 1 && totalListPages === 0) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [pageCount]);

  useEffect(() => {
    if (data.length > 0) {
      currentPageData();
    }
  }, [currentPage, totalResults, pageCount, data.length]);

  useEffect(() => {
    if (totalPages === 1) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [totalPages]);

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
    resetPagination
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
    currentPage
  };
};

export default usePagination;
