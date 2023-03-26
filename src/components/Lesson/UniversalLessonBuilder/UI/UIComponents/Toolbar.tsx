import Buttons from '@components/Atoms/Buttons';

import {useOverlayContext} from 'contexts/OverlayContext';
import React from 'react';
import {AiOutlineCopy, AiOutlineDelete, AiOutlineFileAdd} from 'react-icons/ai';

const Toolbar = ({
  deleteLesson,
  setEditMode,
  setFields,
  setNewLessonPlanShow,
  newLessonPlanShow
}: {
  deleteLesson: () => void;
  newLessonPlanShow: boolean;
  setNewLessonPlanShow: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setFields: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {setShowDataForCopyClone} = useOverlayContext();

  return (
    <>
      <nav className="flex mr-4">
        <div className="flex items-center">
          <div className="flex gap-2 items-center w-auto">
            <Buttons
              onClick={() => {
                if (!newLessonPlanShow) {
                  setShowDataForCopyClone(true);
                }
              }}
              size="middle"
              tooltip="Copy/Clone"
              Icon={AiOutlineCopy}
            />

            <Buttons
              size="middle"
              tooltip="+ New Page"
              onClick={() => {
                setNewLessonPlanShow(true);
                setEditMode(false);
                setFields({
                  title: '',
                  label: '',
                  instructions: '',
                  instructionsHtml: '',
                  description: '', // ignore this field
                  interactionType: [],
                  tags: [],
                  estTime: '1 min',
                  classwork: true
                });
              }}
              Icon={AiOutlineFileAdd}
            />

            <Buttons
              size="middle"
              tooltip="Delete page"
              redBtn
              Icon={AiOutlineDelete}
              onClick={deleteLesson}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Toolbar;
