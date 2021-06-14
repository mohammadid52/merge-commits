import React from 'react';
import {Transition} from '@headlessui/react';
import SlideOutBuilderMenu from './BuilderMenu/SlideOutBuilderMenu';

export interface BuilderMenuProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
}

export const BuilderMenu = (props: BuilderMenuProps) => {
  const {builderMenuVisible} = props;

  return (
    <div
      className={`${
        builderMenuVisible ? 'relative w-48 h-0 mr-0 ml-auto bg-gray-400 z-50' : 'hidden'
      }`}>
      <Transition
        show={builderMenuVisible}
        enter="transition duration-200"
        enterFrom="opacity-0 transform translate-x-48"
        enterTo="opacity-100 transform translate-x-0"
        leave="transition duration-200"
        leaveFrom="opacity-100 transform translate-x-0"
        leaveTo="opacity-0 transform translate-x-48">
        {/* Header */}
        <div className="relative bg-white py-2 ">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-400"></div>
          </div>
          <div className="relative flex text-center">
            <span className="text-sm text-gray-900">Menu</span>
          </div>
        </div>

        {/* MENU BOETONS */}
        <SlideOutBuilderMenu />
      </Transition>
    </div>
  );
};
