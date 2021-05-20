import React from 'react';
import { BsLayers } from 'react-icons/all';
import { IconContext } from 'react-icons';
import { BuilderMenuProps } from '../BuilderMenu';
import { AiOutlineDelete, AiOutlineSave } from 'react-icons/ai';
import { VscDiscard } from 'react-icons/vsc';

const SlideOutBuilderMenu = (props: BuilderMenuProps) => {


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

  const getMenuIcon = (partType: string) => {
    switch (partType) {
      case 'save_changes':
        return <AiOutlineSave />;
      case 'discard_changes':
        return <VscDiscard />;
      case 'delete_lesson':
        return <AiOutlineDelete />;
      default:
        return <BsLayers />;
    }
  };

  return (
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
                    {getMenuIcon(option.id)}
                  </IconContext.Provider>
                  <span>{option.value}</span>
                </button>
              </div>
            )
          )}
        </nav>
      </div>
    </div>
  )
}

export default SlideOutBuilderMenu;