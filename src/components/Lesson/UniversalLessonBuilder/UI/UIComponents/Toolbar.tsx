import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFileAdd,
  AiOutlineFileSearch,
  AiOutlineSave,
} from 'react-icons/ai';

import {IconType} from 'react-icons/lib';
import {RiDragDropFill, RiDragDropLine} from 'react-icons/ri';
import {VscDiscard} from 'react-icons/vsc';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import useOnScreen from '../../../../../customHooks/useOnScreen';
import Tooltip from '../../../../Atoms/Tooltip';

const Button = ({
  onClick,
  icon: Icon,
  text = '',
  tooltip = '',
  invert = false,
  color = 'text-white',
}: {
  onClick?: () => void;
  icon?: IconType;
  tooltip?: string;
  text?: string;
  color?: string;
  invert?: boolean;
}) => {
  return (
    <Tooltip show={tooltip.length > 0} text={tooltip} placement="bottom">
      <button
        onClick={onClick}
        type="button"
        className={`${
          invert ? 'bg-indigo-600' : 'bg-transparent'
        } ${color} mx-2 hover:shadow-lg w-auto  inline-flex justify-center items-center p-2 border border-transparent rounded-md hover:text-white  transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        {text}
      </button>
    </Tooltip>
  );
};

const Divider = ({theme = 'dark'}: any) => (
  <span
    style={{width: 1}}
    className={`h-8 mx-2 ${theme === 'dark' ? 'bg-white' : 'bg-gray-600'} bg-opacity-50 `}
  />
);

const Container = ({children}: {children: any}) => (
  <div className="flex items-center w-auto">{children}</div>
);

const Toolbar = ({
  deleteLesson,
  setEditMode,
  setFields,

  setNewLessonPlanShow,
}: {
  deleteLesson: () => void;

  setNewLessonPlanShow: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setFields: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {previewMode, setPreviewMode, setToolbarOnTop} = useULBContext();

  const {
    state: {
      lessonPage: {
        theme = 'dark',
        themeSecBackgroundColor = 'bg-gray-700',
        themeTextColor = '',
      } = {},
    },
  } = useContext(GlobalContext);
  const toolbarRef = useRef();
  const isVisible = useOnScreen(toolbarRef);
  useEffect(() => {
    setToolbarOnTop(isVisible);
  }, [isVisible]);
  return (
    <>
      {!previewMode && (
        <div
          // hidden={previewMode}
          ref={toolbarRef}
          className={`customShadow rounded-lg toolbar ${themeSecBackgroundColor} w-auto p-2`}>
          <div className="flex items-center">
            <Container>
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                tooltip="Preview"
                color={themeTextColor}
                icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
              />

              <>
                {/* <Button
                  color={themeTextColor}
                  onClick={() => setEnableDnD(!enableDnD)}
                  tooltip="Enable Drag"
                  icon={enableDnD ? RiDragDropFill : RiDragDropLine}
                /> */}
                <Button
                  color={themeTextColor}
                  tooltip="Add New Page"
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
                      classwork: true,
                    });
                  }}
                  icon={AiOutlineFileAdd}
                />
                <Divider theme={theme} />
              </>
            </Container>

            <Container>
              {/* <Button
                color={themeTextColor}
                tooltip="Enable Drag"
                icon={enableDnD ? RiDragDropFill : RiDragDropLine}
              /> */}
              <Button
                color={themeTextColor}
                tooltip="Search Page"
                icon={AiOutlineFileSearch}
              />
              <Divider theme={theme} />
            </Container>

            <Container>
              <Button
                color={themeTextColor}
                tooltip="Save changes"
                icon={AiOutlineSave}
              />
              <Button
                color={themeTextColor}
                tooltip="Discard changes"
                icon={VscDiscard}
              />

              <Button
                color="text-red-500"
                tooltip="Delete this page"
                icon={AiOutlineDelete}
                onClick={deleteLesson}
              />
            </Container>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
