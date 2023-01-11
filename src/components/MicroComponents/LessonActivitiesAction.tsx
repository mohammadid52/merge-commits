import Popover from '@components/Atoms/Popover';
import {useGlobalContext} from '@contexts/GlobalContext';
import {LessonBuilderDict, BUTTONS} from '@dictionary/dictionary.iconoclast';
import React, {useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

const LessonActivitiesAction = ({id, lessonPagePreview, toggleDeleteModal}: any) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const gContext = useGlobalContext();
  const userLanguage = gContext.userLanguage;

  return (
    <div className={``}>
      <Popover
        show={showMenu}
        bottom={1.5}
        dir={'top'}
        minWidth={48}
        minHeight={16}
        rounded="lg"
        setShow={setShowMenu}
        content={
          <dl className="grid grid-cols-1 gap-y-3">
            <div className="col-span-1">
              <dt
                onClick={() => lessonPagePreview(id)}
                className={`text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500 cursor-pointer`}>
                {LessonBuilderDict[userLanguage]['BUTTON']['PREVIEW']}
              </dt>
            </div>
            <div className="col-span-1">
              <dt
                onClick={() => {
                  setShowMenu(false);
                  toggleDeleteModal(true, id);
                }}
                className={`text-sm leading-5 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500 cursor-pointer text-red-500 hover:text-red-600`}>
                {BUTTONS[userLanguage]['DELETE']}
              </dt>
            </div>
          </dl>
        }>
        <span className="h-6 w-6 flex items-center justify-center p-1 hover:bg-gray-200 transition-all cursor-pointer rounded-full">
          <BiDotsVerticalRounded
            title="show menu"
            className="h-full w-full text-lg text-gray-500"
          />
        </span>
      </Popover>
    </div>
  );
};

export default LessonActivitiesAction;
