import Buttons from '@components/Atoms/Buttons';
import {Tooltip} from 'antd';

import {useOverlayContext} from 'contexts/OverlayContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import React from 'react';
import {
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFileAdd
} from 'react-icons/ai';

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
  const {previewMode, setPreviewMode} = useULBContext();

  const {setShowDataForCopyClone} = useOverlayContext();

  return (
    <>
      <nav className="flex">
        <div className="flex items-center">
          <div className="flex gap-2 items-center w-auto">
            <Tooltip title={'same sfdf'}>
              <Buttons
                onClick={() => setPreviewMode(!previewMode)}
                variant="default"
                size="middle"
                Icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
              />
            </Tooltip>
            <Tooltip title={'same sfdf'}>
              <Buttons
                onClick={() => {
                  if (!newLessonPlanShow) {
                    setShowDataForCopyClone(true);
                  }
                }}
                variant="default"
                size="middle"
                Icon={AiOutlineCopy}
              />
            </Tooltip>
            <Tooltip title={'same sfdf'}>
              <Buttons
                variant="default"
                size="middle"
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
            </Tooltip>

            <Buttons
              variant="default"
              size="middle"
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
