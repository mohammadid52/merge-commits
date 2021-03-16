import React, { Fragment, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { EditDefaultContent } from './EditContentViews/EditDefaultContent';
import { EditQuoteContent } from './EditContentViews/EditQuoteContent';

// Standard widget card view
export const EditModeView = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    setEditorContent,
    handleActivation,
    handleEditUpdateDefault,
    handleEditUpdateQuotes,
    viewEditMode,
    newWidgetData,
    setNewWidgetData,
    widgetData,
    setWidgetData,
  } = props;
  const { theme } = useContext(GlobalContext);
  return (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        <span className={`text-left ${theme.lessonCard.subtitle}`}>
          Widget Status:
          {widgetObj.active ? (
            <span className="ml-2 text-xs font-semibold text-green-400">Active</span>
          ) : (
            <span className="ml-2 text-xs font-semibold text-gray-400">Inactive</span>
          )}
        </span>
        <span className={`text-center ${theme.lessonCard.subtitle}`}>
          {widgetObj.active ? (
            <span
              onClick={() => handleActivation(widgetObj.id)}
              className="ml-2 cursor-pointer text-base text-ketchup font-semibold">
              Deactivate
            </span>
          ) : (
            <span
              onClick={() => handleActivation(widgetObj.id)}
              className="ml-2 cursor-pointer text-base text-blueberry font-semibold">
              Activate
            </span>
          )}
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>Placement: {widgetObj.placement}</span>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={`mt-2 `}>
        <Fragment>
          <label htmlFor={widgetObj.id} className="block text-xs font-semibold leading-5 text-gray-700">
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
       *  section: DESCRIPTION
       */}
      <div className={`mt-2 overflow-ellipsis overflow-hidden ellipsis`}>
        <Fragment>
          <label htmlFor={widgetObj.id} className="block text-xs font-semibold leading-5 text-gray-700">
            {`Description`}
          </label>
          <input
            type="text"
            id={`${widgetObj.id}`}
            data-basekey={`description`}
            onChange={handleEditUpdateDefault}
            value={widgetObj.description ? widgetObj.description : ''}
            className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
            placeholder={widgetObj.description ? widgetObj.description : `Please add title...`}
          />
        </Fragment>
      </div>
      {/**
       *  section:  CONTENT
       *  - Toggles between differnet edit forms
       */}
      {widgetObj.type === 'default' ? (
        <EditDefaultContent
          widgetObj={widgetObj}
          setEditorContent={setEditorContent}
          handleActivation={handleActivation}
          newWidgetData={newWidgetData}
          setNewWidgetData={setNewWidgetData}
          setWidgetData={setWidgetData}
          viewEditMode={viewEditMode}
          widgetData={widgetData}
        />
      ) : null}
      {widgetObj.type === 'quote' ? (
        <EditQuoteContent
          newWidgetData={newWidgetData}
          setNewWidgetData={setNewWidgetData}
          widgetData={widgetData}
          setWidgetData={setWidgetData}
          handleEditUpdateQuotes={handleEditUpdateQuotes}
          viewEditMode={viewEditMode}
          widgetObj={widgetObj}
          setEditorContent={setEditorContent}
          handleActivation={handleActivation}
        />
      ) : null}
    </>
  );
};
