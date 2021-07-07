import React from 'react';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFileAdd,
  AiOutlineFileSearch,
} from 'react-icons/ai';

import {IconType} from 'react-icons/lib';
import {RiDragDropFill, RiDragDropLine} from 'react-icons/ri';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import Tooltip from '../../../../Atoms/Tooltip';

const Button = ({
  onClick,
  icon: Icon,
  text = '',
  tooltip = '',
  invert = false,
}: {
  onClick?: () => void;
  icon?: IconType;
  tooltip?: string;
  text?: string;
  invert?: boolean;
}) => {
  return (
    <Tooltip show={tooltip.length > 0} text={tooltip} placement="bottom">
      <button
        onClick={onClick}
        type="button"
        className={`${
          invert ? 'bg-indigo-600' : 'bg-transparent'
        } mx-2 hover:shadow-lg w-auto inline-flex justify-center items-center p-2 border border-transparent rounded-md text-white  transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        {text}
      </button>
    </Tooltip>
  );
};

const Divider = () => (
  <span style={{width: 1}} className="h-8 mx-2 bg-white bg-opacity-50 " />
);

const Container = ({children}: {children: any}) => (
  <div className="flex items-center w-auto">{children}</div>
);

const ActionLeft = ({newLessonPlanShow, setNewLessonPlanShow}: any) => {
  const {previewMode, setPreviewMode, enableDnD, setEnableDnD} = useULBContext();

  return (
    <div
      style={{boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}
      // hidden={previewMode}
      className={`rounded-lg relative bg-gray-700 w-auto col-span-1 p-2`}>
      <div className="flex items-center">
        <Container>
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            tooltip="Preview"
            icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
          />
          {!previewMode && (
            <>
              <Button
                onClick={() => setEnableDnD(!enableDnD)}
                tooltip="Enable Drag"
                icon={enableDnD ? RiDragDropFill : RiDragDropLine}
              />
              <Button
                tooltip="Add New Page"
                onClick={() => setNewLessonPlanShow(true)}
                icon={AiOutlineFileAdd}
              />
              <Divider />
            </>
          )}
        </Container>

        {!previewMode && (
          <Container>
            <Button
              tooltip="Enable Drag"
              icon={enableDnD ? RiDragDropFill : RiDragDropLine}
            />
            <Button tooltip="Search Page" icon={AiOutlineFileSearch} />
          </Container>
        )}
      </div>
    </div>
  );
};

export default ActionLeft;
