import React, { Fragment, useContext, useEffect } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { EditDefaultContent } from './EditContentViews/EditDefaultContent';
import { EditQuoteContent } from './EditContentViews/EditQuoteContent';
import CreateWidgetToolbar from './createWidgetToolbar';

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
    resetNewWidgetData,
    newWidgetData,
    setNewWidgetData,
    setWidgetData,
    widgetData,
  } = props;
  const { theme } = useContext(GlobalContext);

  useEffect(()=>{
    return ()=> resetNewWidgetData();
  },[widgetObj])

  return (
    <>
      {/**
       *  section: TOP INFO
       */}
      <CreateWidgetToolbar
        widgetObj={widgetObj}
        handleEditUpdateDefault={handleEditUpdateDefault}
        handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
      />
      {/**
       *  section: TITLE
       */}
      <div className={`mt-2 py-2 px-2`}>
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
      ) : null}
    </>
  );
};
