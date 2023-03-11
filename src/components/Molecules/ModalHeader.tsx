import React from "react";
import { IoClose } from "react-icons/io5";

export const CloseButton = ({
  onClick,
  modalCloseId = "",
}: {
  onClick: () => void;
  modalCloseId?: string;
}) => (
  <button
    data-cy={modalCloseId}
    className={`ml-auto w-auto outline-none absolute right-1`}
    onClick={onClick}
  >
    <span className="w-8 h-8 theme-text:100 hover:theme-bg:400 hover:text-white flex cursor-pointer rounded-xl items-center justify-center  transition-all duration-150">
      <IoClose size={"1.5rem"} />
    </span>
  </button>
);

const ModalHeader = (headerProps: {
  title?: string;
  onClick?: () => void;
  titleButton?: React.ReactElement;
  customTitle?: React.ReactNode;
  showBorder?: boolean;
  modalCloseId?: string;
}) => {
  const {
    title,
    onClick = () => {},
    modalCloseId,

    customTitle,
    titleButton,
  } = headerProps;

  return (
    <div
      className={`theme-bg flex items-center text-white rounded-t-xl px-4 py-2`}
    >
      <div className="flex items-center">
        {title ? (
          <h3 className="text-lg text-center tracking-wider font-medium uppercase text-white">
            {title}
          </h3>
        ) : customTitle ? (
          customTitle
        ) : null}
        {titleButton}
      </div>

      <CloseButton modalCloseId={modalCloseId} onClick={onClick} />
    </div>
  );
};

export default ModalHeader;
