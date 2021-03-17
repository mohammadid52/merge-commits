import React, { Fragment, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { EditDefaultContent } from './EditContentViews/EditDefaultContent';
import { EditQuoteContent } from './EditContentViews/EditQuoteContent';
import CreateEditDropdown from './createEditDropdown';

// Standard widget card view
export const CreateModeView = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    setEditorContent,
    handleActivation,
    handleEditUpdateDefault,
    handleEditUpdateQuotes,
    handleEditUpdateWYSIWYG,
    viewEditMode,
    newWidgetData,
    setNewWidgetData,
    setWidgetData,
    widgetData,
  } = props;
  const { theme } = useContext(GlobalContext);
  return (
    <div className={`p-2`}>
      {/**
       *  section: TOP INFO
       */}
      <CreateEditDropdown
        widgetObj={widgetObj}
        handleEditUpdateDefault={handleEditUpdateDefault}
        handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
      />
      {/**
       *  section: TITLE
       */}
      <div className={`mt-2 p-2`}>
        <Fragment>
          <label htmlFor={widgetObj.id} className="block text-sm font-semibold leading-5 text-gray-700">
            {`Title`}
          </label>
          <input
            type="text"
            id={`${widgetObj.id}`}
            data-basekey={`title`}
            onChange={handleEditUpdateDefault}
            value={widgetObj.title ? widgetObj.title : ''}
            className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
            placeholder={widgetObj.title ? widgetObj.title : `Please add title...`}
          />
        </Fragment>
      </div>
      {/**
       *  section:  CONTENT
       *  - Toggles between differnet edit forms
       */}
      {widgetObj.type === 'default' ? (
        <EditDefaultContent
          handleEditUpdateDefault={handleEditUpdateDefault}
          viewEditMode={viewEditMode}
          widgetObj={widgetObj}
          setEditorContent={setEditorContent}
          handleActivation={handleActivation}
          newWidgetData={newWidgetData}
          setNewWidgetData={setNewWidgetData}
          setWidgetData={setWidgetData}
          widgetData={widgetData}
        />
      ) : null}

      {widgetObj.type === 'quote' || widgetObj.type === 'call' ? (
        <div className={`p-2`}>
          <EditQuoteContent
            handleEditUpdateQuotes={handleEditUpdateQuotes}
            viewEditMode={viewEditMode}
            widgetObj={widgetObj}
            setEditorContent={setEditorContent}
            handleActivation={handleActivation}
            newWidgetData={newWidgetData}
            setNewWidgetData={setNewWidgetData}
            setWidgetData={setWidgetData}
            widgetData={widgetData}
          />
        </div>
      ) : null}
    </div>
  );
};
