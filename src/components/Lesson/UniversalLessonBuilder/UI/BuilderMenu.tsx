import React from 'react';
import {Transition} from '@headlessui/react';
import SlideOutBuilderMenu from './BuilderMenu/SlideOutBuilderMenu';
import ClickAwayListener from 'react-click-away-listener';

export interface BuilderMenuProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilderMenuVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
}

export const BuilderMenu = (props: BuilderMenuProps) => {
  const {builderMenuVisible, setBuilderMenuVisible} = props;

  return (
    <div
      className={`${
        builderMenuVisible ? 'relative w-56 h-0 mr-0 ml-auto bg-gray-400' : 'hidden'
      }`}
      style={{zIndex: 99999}}>
      <div className="absolute" style={{top: '0.5rem', right: '2rem'}}>
        <Transition
          show={builderMenuVisible}
          enter="transition duration-200"
          enterFrom="opacity-0 transform translate-x-48"
          enterTo="opacity-100 transform translate-x-0"
          leave="transition duration-200"
          leaveFrom="opacity-100 transform translate-x-0"
          leaveTo="opacity-0 transform translate-x-48">
          {/* Header */}
          <ClickAwayListener onClickAway={() => setBuilderMenuVisible(false)}>
            <>
              <div className="relative text-white bg-dark py-2 rounded-t-lg ">
                <div className="absolute  flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-400"></div>
                </div>
                <div className="relative flex text-center">
                  <span className="text-md text-white font-semibold">Menu</span>
                </div>
              </div>
              <SlideOutBuilderMenu />
            </>
          </ClickAwayListener>
        </Transition>
      </div>
    </div>
  );
};
