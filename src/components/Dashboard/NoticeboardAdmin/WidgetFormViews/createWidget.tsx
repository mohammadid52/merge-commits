import React, { Fragment, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { EditDefaultContent } from './EditContentViews/EditDefaultContent';
import { EditQuoteContent } from './EditContentViews/EditQuoteContent';

// Standard widget card view
export const CreateModeView = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    setEditorContent,
    handleActivation,
    handleEditUpdateDefault,
    handleEditUpdateQuotes,
    viewEditMode,
    newWidgetData,
    setNewWidgetData,
    setWidgetData,
    widgetData,
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
          <select name="status" id="status" data-basekey="active" onChange={(e) => handleEditUpdateDefault(e)}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>
          Placement:
          <select name="placement" id="placement" data-basekey="placement" onChange={(e) => handleEditUpdateDefault(e)}>
            <option value="topbar">Top</option>
            <option value="sidebar" selected>Side</option>
          </select>
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>
          Type:
          <select name="type" id="type" data-basekey="type" onChange={(e) => handleEditUpdateDefault(e)}>
            <option value="default" selected>Default</option>
            <option value="quote">Quote</option>
          </select>
        </span>
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
      {widgetObj.type === 'quote' ? (
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
