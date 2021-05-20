import React from 'react';
import {Transition} from '@headlessui/react';
import {IconContext} from 'react-icons';

interface BuilderMenuProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
}

export const BuilderMenu = (props: BuilderMenuProps) => {
  const {galleryVisible, setGalleryVisible, builderMenuVisible} = props;

  const dropDownOptions = [
    // {
    //   id: 'save_draft',
    //   value: 'Save Draft',
    //   option: 'Save Draft',
    // },
    // {
    //   id: 'publish_lesson',
    //   value: 'Publish Lesson',
    //   option: 'Publish Lesson',
    // },
    {
      id: 'save_changes',
      value: 'Save Changes',
      option: 'Save Changes',
    },
    {
      id: 'discard_changes',
      value: 'Discard Changes',
      option: 'Discard Changes',
    },
    {
      id: 'delete_lesson',
      value: 'Delete Lesson',
      option: 'Delete Lesson',
    },
  ];

  return (
    <div
      className={`${
        builderMenuVisible ? 'relative w-48 h-0 mr-0 ml-auto bg-gray-400 z-50' : 'hidden'
      }`}>
      <Transition
        show={builderMenuVisible}
        enter="transition duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 transform">
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
        <div className="w-48 flex flex-col flex-grow p-1 overflow-y-auto bg-gray-400">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1" aria-label="BuilderMenu">
              {/* Menu Options */}
              {dropDownOptions &&
                dropDownOptions.map(
                  (option: {id: string; value: string; option: string}, idx: number) => (
                    <div key={`menu_btn_${idx}`} className={`border-b-0 border-gray-400`}>
                      <button
                        id={option.id}
                        type="button"
                        className={`bg-white text-gray-800
                      hover:text-gray-900
                      group w-full flex
                      items-center p-2 text-sm
                      font-medium
                      border-r-4 border-indigo-600
                      `}
                        aria-controls={`sub-menu-${idx}`}
                        aria-expanded="false">
                        <IconContext.Provider
                          value={{className: 'w-auto mr-2', size: '24px'}}>
                          {/*{getTreeIcon('')}*/}
                        </IconContext.Provider>
                        <span>{option.value}</span>
                      </button>
                    </div>
                  )
                )}
            </nav>
          </div>
        </div>
      </Transition>
    </div>
  );
};
