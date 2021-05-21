import React, {useState, useEffect, useContext} from 'react';
import {IconContext} from 'react-icons';
import {FaAngleRight, FaAngleLeft} from 'react-icons/fa';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getAsset} from '../../assets';

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

const Active = (activeProps: {page: number}) => {
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <button
      className={`${theme.btn[themeColor]} py-2 px-4 rounded-full ml-2 w-10 cursor-default hover:outline-none focus:outline-none `}>
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
      className="hover:outline-none cursor-pointer focus:outline-none w-auto py-2 px-4 rounded-full">
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
  if (page === currentPage) return <Active page={page} />;
  return (
    <Inactive page={page} currentPage={currentPage} setPrev={setPrev} setNext={setNext} />
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
  const [showNumbers, setShowNumbers] = useState([]);

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
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <button
      onClick={onClick}
      className={`btn btn-default w-20 ${theme.outlineNone} ${
        !active ? 'cursor-default' : ''
      }`}
      disabled={!active}>
      <span className="w-6 cursor-pointer hover:text-gray-400">
        <IconContext.Provider
          value={{
            size: '1.5rem',
            color: `${active ? theme.iconColor[themeColor] : 'darkgrey'}`,
          }}>
          {isBack ? <FaAngleLeft /> : <FaAngleRight />}
        </IconContext.Provider>
      </span>
    </button>
  );
};

const Pagination: React.FC<PaginationProps> = (pageProps: PaginationProps) => {
  const {currentPage, lastPage, firstPage, setNext, setPrev} = pageProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <div className="flex flex-wrap items-center justify-center">
      <PageArrows onClick={setPrev} active={currentPage !== 1} isBack={true} />
      {currentPage !== 1 && (
        <span className={`w-auto mr-2 ${theme.textColor[themeColor]}`}> . . . </span>
      )}
      <PageCount
        setPrev={setPrev}
        setNext={setNext}
        firstPage={firstPage}
        lastPage={lastPage}
        currentPage={currentPage}
      />
      {!lastPage && (
        <span className={`w-auto ml-2 ${theme.textColor[themeColor]}`}> . . . </span>
      )}
      <PageArrows onClick={setNext} active={!lastPage} />
    </div>
  );
};

export default Pagination;
