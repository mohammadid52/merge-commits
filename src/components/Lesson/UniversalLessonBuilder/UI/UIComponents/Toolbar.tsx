import Tooltip from '@atoms/Tooltip';
import {GlobalContext} from '@contexts/GlobalContext';
import {useOverlayContext} from '@contexts/OverlayContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useOnScreen from '@customHooks/useOnScreen';
import {UniversalLesson} from '@interfaces/UniversalLessonInterfaces';
import React, {useContext, useEffect, useRef} from 'react';
import {
  AiOutlineCopy,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFileAdd,
} from 'react-icons/ai';
import {IconType} from 'react-icons/lib';

const Button = ({
  onClick,
  icon: Icon,
  text = '',
  tooltip = '',
  invert = false,
  color = 'text-white',
  tooltipPlacement = 'bottom',
  top = false,
}: {
  onClick?: () => void;
  icon?: IconType;
  tooltip?: string;
  text?: string;
  color?: string;
  tooltipPlacement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
  invert?: boolean;
  top?: boolean;
}) => {
  return (
    <Tooltip
      show={!text && tooltip.length > 0}
      text={tooltip}
      placement={tooltipPlacement}>
      <button
        onClick={onClick}
        type="button"
        className={`${
          invert ? 'bg-indigo-600' : 'bg-transparent'
        } ${color} mx-2  w-auto  inline-flex justify-center items-center px-2 py-1 border border-transparent rounded-md  transition-all hover:text-gray-500`}>
        {Icon && <Icon className={`h-7 w-7 ${top ? 'mr-2 ' : ''}`} aria-hidden="true" />}
        <span className="hidden xl:block">{text}</span>
      </button>
    </Tooltip>
  );
};

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
  const {
    previewMode,
    setPreviewMode,

    setToolbarOnTop,
    toolbarOnTop,
  } = useULBContext();

  const {
    state: {lessonPage: {theme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const toolbarRef = useRef();
  const isVisible = useOnScreen(toolbarRef);

  useEffect(() => {
    setToolbarOnTop(isVisible);
  }, [isVisible]);

  const {setShowDataForCopyClone, newLessonPlanShow} = useOverlayContext();

  return (
    <>
      <div
        // hidden={previewMode}
        ref={toolbarRef}
        style={{transform: previewMode ? 'translateX(40rem)' : 'translateX(0rem)'}}
        className={` ${
          !toolbarOnTop
            ? 'opacity-0 -translate-y-12 scale-90'
            : 'opacity-100 scale-100 translate-y-0'
        } customShadow transform ${
          previewMode ? 'fixed' : ''
        } rounded-lg toolbar bg-white dark:bg-gray-700 ease-out transition-all duration-200  w-auto p-2`}>
        <div className="flex items-center">
          <div className="flex items-center w-auto">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              tooltip="Preview"
              text="Preview"
              top
              color={themeTextColor}
              icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
            />

            <div
              className={`${
                previewMode ? 'scale-0 opacity-80' : 'scale-100 opacity-100 ml-6 '
              } space-x-6 transition-all transform flex`}>
              {!previewMode && (
                <>
                  <Button
                    onClick={() => {
                      if (!newLessonPlanShow) {
                        setShowDataForCopyClone(true);
                      }
                    }}
                    tooltip="Copy / Clone"
                    text="Copy / Clone"
                    color={themeTextColor}
                    top
                    icon={AiOutlineCopy}
                  />

                  <Button
                    text="Add New Page"
                    color={themeTextColor}
                    top
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
                  <Button
                    color="text-red-400"
                    tooltip="Delete this page"
                    top
                    text="Delete this page"
                    icon={AiOutlineDelete}
                    onClick={deleteLesson}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
