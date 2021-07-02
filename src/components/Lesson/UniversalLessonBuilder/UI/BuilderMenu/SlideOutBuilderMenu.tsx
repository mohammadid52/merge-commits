import React from 'react';
import {BsLayers} from 'react-icons/all';
import {IconContext} from 'react-icons';
import {BuilderMenuProps} from '../BuilderMenu';
import {AiOutlineDelete, AiOutlineSave} from 'react-icons/ai';
import {VscDiscard} from 'react-icons/vsc';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';

const SlideOutBuilderMenu = ({onActionClick}: BuilderMenuProps) => {
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
      action: 'save',
    },
    {
      id: 'discard_changes',
      value: 'Discard Changes',
      option: 'Discard Changes',
      action: 'discard',
    },
    {
      id: 'delete_lesson',
      value: 'Delete Lesson',
      option: 'Delete Lesson',
      action: 'delete',
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
  const {theme} = useULBContext();

  return (
    <>
      <div
        className={`flex flex-col flex-grow p-1 overflow-y-auto overflow-hidden ${theme.bg} rounded-b-lg`}>
        <div className="flex-grow flex flex-col">
          <nav
            className="flex flex-col items-center justify-center rounded-b-lg"
            aria-label="BuilderMenu">
            {/* Menu Options */}
            {dropDownOptions &&
              dropDownOptions.map(
                (
                  option: {id: string; value: string; option: string; action: string},
                  idx: number
                ) => (
                  <button
                    key={`menu_btn_${idx}`}
                    id={option.id}
                    type="button"
                    className={`${
                      theme.bg
                    }  mx-2 px-4 w-52 my-2 py-2 font-bold uppercase text-xs rounded-lg text-white hover:bg-white hover:bg-opacity-10 flex items-center p-2 text-left ${
                      option.id === 'delete_lesson' ? 'text-red-400' : ''
                    }`}
                    aria-controls={`sub-menu-${idx}`}
                    aria-expanded="false"
                    onClick={() => onActionClick(option.action)}>
                    <IconContext.Provider
                      value={{className: 'w-auto mr-2', size: '24px'}}>
                      {getMenuIcon(option.id)}
                    </IconContext.Provider>
                    <span>{option.value}</span>
                  </button>
                )
              )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SlideOutBuilderMenu;
