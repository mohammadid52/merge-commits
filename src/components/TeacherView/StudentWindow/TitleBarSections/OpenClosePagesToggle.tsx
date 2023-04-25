import {StudentWindowTitleBarProps} from '../StudentWindowTitleBar';

interface IOpenClosePagesToggle extends StudentWindowTitleBarProps {
  currentPage?: number;
  activePageData?: any;
  handleOpenComponent?: (pageNr: number) => void;
  handleCloseComponent?: (pageNr: number) => void;
}

const OpenClosePagesToggle = ({
  currentPage = 0,
  activePageData,
  handleOpenComponent,
  handleCloseComponent
}: IOpenClosePagesToggle) => {
  return (
    <div className="w-1/3 flex justify-start h-8 align-middle leading-8 ">
      {/**
       *
       * TITLEBAR LESSON CONTROL
       *
       * open/close & enable/disable buttons are only
       * visible when teacher is NOT on the intro,
       * and when you're NOT currently viewing a studento
       *
       */}
      {currentPage !== 0 && activePageData && activePageData?.disabled !== true ? (
        <span
          className={`mr-2 theme-text w-auto h-6 my-auto text-sm text-medium  underline leading-4 text-underline transform hover:scale-110 transition-transform duration-150 p-1 cursor-pointer`}
          onClick={() =>
            activePageData?.open
              ? handleCloseComponent?.(currentPage)
              : handleOpenComponent?.(currentPage)
          }>
          {activePageData?.open ? 'Close' : 'Open'} Component
        </span>
      ) : null}
    </div>
  );
};

export default OpenClosePagesToggle;
