import AnimatedContainer from "@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer";
import React, { useEffect, useRef, useState } from "react";
import { getImageFromS3 } from "utilities/services";
import Placeholder from "../Placeholder";
import Label from "./Label";

interface MultipleSelectorProps {
  list?: { id: string; name: string; value?: string; avatar?: string }[];
  selectedItems?: { id?: string; name?: string; value?: string }[];
  btnClass?: string;
  arrowHidden?: boolean;
  noOptionMessage?: string;
  placeholder: string;
  disabledText?: string;
  onChange: (id: string, name: string, value: string) => void;
  disabled?: boolean;
  withAvatar?: boolean;
  isRequired?: boolean;
  label?: string;
}

const MultipleSelector = (props: MultipleSelectorProps) => {
  const {
    list,
    disabled,
    withAvatar = false,
    selectedItems,
    btnClass,
    arrowHidden,
    placeholder,
    isRequired,
    onChange,
    disabledText,
    noOptionMessage,
    label,
  } = props;
  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef<any>(null);
  const [modifiedList, setModifiedList] = useState<any[]>([]);

  const handleOutsideClick = (e: any) => {
    const stringElement = e.target.innerHTML;
    if (
      !stringElement ||
      currentRef.current.outerHTML.indexOf(stringElement) === -1
    ) {
      window.removeEventListener("click", handleOutsideClick, false);
      if (showList) setShowList(false);
    }
  };

  useEffect(() => {
    if (showList) {
      window.addEventListener("click", handleOutsideClick, false);
    } else {
      window.removeEventListener("click", handleOutsideClick, false);
    }
  }, [showList]);

  const getList = (listData: any) => {
    let modifiedlist: any = [];

    listData.forEach(async (item: any) => {
      const imagePath = item?.image;

      const image = await (imagePath !== null
        ? getImageFromS3(imagePath)
        : null);

      const modifiedItem = { ...item, avatar: image };

      modifiedlist.push(modifiedItem);
    });

    return modifiedlist;
  };

  React.useEffect(() => {
    if (list && list.length > 0) {
      if (withAvatar) {
        const modifiedlist = getList(list);
        setModifiedList(modifiedlist);
      } else {
        setModifiedList(list);
      }
    } else {
      setModifiedList([]);
    }
  }, [list, withAvatar]);

  const isSelected = (id: string) => selectedItems?.find((i) => i.id === id);

  return (
    <div className="relative" ref={currentRef}>
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <span className="inline-block w-full h-full rounded-full shadow-sm">
        <button
          disabled={disabled}
          onClick={() => setShowList(!showList)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`${
            disabled
              ? "bg-gray-200 pointer-events-none cursor-not-allowed"
              : "cursor-pointer"
          } flex items-center  multiple-selector hover:theme-bg:200 hover:theme-border:400 hover:theme-text:400 relative w-full h-full rounded-full  border-0 border-gray-300 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ""
          }`}
        >
          <span className="block truncate text-gray-700">
            {disabled
              ? disabledText
              : selectedItems?.length
              ? selectedItems?.length < 3
                ? selectedItems?.map(
                    (item, index) =>
                      item.name +
                      `${selectedItems?.length - 1 === index ? "." : "," + " "}`
                  )
                : `${selectedItems?.length || 0} items Selected`
              : placeholder}
          </span>
          <span
            className={`relative justify-end inset-y-0 right-0 items-center pr-2 pointer-events-none ${
              arrowHidden ? "hidden" : "flex"
            }`}
          >
            <svg
              className="h-5 w-5 text-gray-400 arrow-up-down"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </span>
      <AnimatedContainer show={showList} className="z-50 absolute w-full ">
        {showList && (
          <div className="z-50 absolute mt-1 w-full rounded-xl bg-white shadow-lg">
            <ul
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-item-3"
              className="max-h-60 focus:shadow-none rounded-xl py-1 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5"
            >
              {modifiedList.length > 0 ? (
                modifiedList.map(
                  (
                    item: {
                      id: string;
                      name: string;
                      value: string;
                      avatar?: string;
                    },
                    key: number
                  ) => {
                    return (
                      <li
                        key={key}
                        onClick={() => onChange(item.id, item.name, item.value)}
                        id={item.id}
                        role="option"
                        className={`${
                          isSelected(item.id)
                            ? "iconoclast:bg-main text-white"
                            : "hover:bg-indigo-100 hover:text-indigo-400"
                        } flex cursor-pointer select-none relative py-2 px-4`}
                      >
                        {withAvatar ? (
                          item.avatar ? (
                            <img
                              src={item.avatar}
                              alt=""
                              className="flex-shrink-0 mr-2 h-6 w-6 rounded-full"
                            />
                          ) : (
                            <Placeholder
                              name={item.name}
                              size=" mr-2 h-6 w-6"
                            />
                          )
                        ) : null}

                        <span
                          className={`${
                            isSelected(item.id)
                              ? "font-semibold"
                              : "font-normal"
                          } block truncate`}
                        >
                          {item.name}
                        </span>
                      </li>
                    );
                  }
                )
              ) : (
                <li className="flex justify-center relative py-2 px-4">
                  <span className="font-normal">
                    {" "}
                    {noOptionMessage || "No Results"}
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default MultipleSelector;
