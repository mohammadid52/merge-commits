import Popover from '@components/Atoms/Popover';
import {useGlobalContext} from '@contexts/GlobalContext';
import {LessonsListDict} from '@dictionary/dictionary.iconoclast';
import React, {useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';

const LessonAction = ({
  onCloneLesson,
  lessonObj,
  handleLessonsEdit,
  handleToggleDelete,
  checkIfRemovable
}: any) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const gContext = useGlobalContext();
  const userLanguage = gContext.userLanguage;

  return (
    <div>
      <span className="w-auto">
        <Popover
          show={showMenu}
          bottom={0.6}
          dir={'top'}
          minWidth={48}
          minHeight={16}
          rounded="lg"
          setShow={setShowMenu}
          content={
            <dl className="grid grid-cols-1 gap-y-3">
              <div className="col-span-1">
                <dt
                  onClick={handleLessonsEdit}
                  className={`text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500 cursor-pointer`}>
                  Edit
                </dt>
              </div>
              <div className="col-span-1">
                <dt
                  onClick={() => {
                    onCloneLesson();
                    setShowMenu(false);
                  }}
                  className={`text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500 cursor-pointer`}>
                  Clone Lesson
                </dt>
              </div>
              <div className="col-span-1">
                {checkIfRemovable(lessonObj) ? (
                  <dt
                    onClick={() => handleToggleDelete(lessonObj.title, lessonObj)}
                    className={`cursor-pointer text-red-500 hover:text-red-600`}>
                    {/* <HiOutlineTrash className="w-4 h-4 pointer-events-none" /> */}
                    Delete
                  </dt>
                ) : (
                  <dt
                    className={`text-center text-gray-500 flex flex-row text-xs pointer-events-none`}>
                    <span className="w-auto">
                      Delete {LessonsListDict[userLanguage]['NO_DELETE']}
                    </span>
                  </dt>
                )}
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
      </span>
    </div>
  );
};

export default LessonAction;
