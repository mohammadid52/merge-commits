import React, { Fragment, useContext, useEffect } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { EditDefaultContent } from './EditContentViews/EditDefaultContent';
import { EditQuoteContent } from './EditContentViews/EditQuoteContent';
import EditWidgetToolbar from './editWidgetToolbar';
import SectionTitle from '../../../Atoms/SectionTitleV2';
import ContentCardTitle from '../../../Atoms/ContentCardTitle';

// Standard widget card view
export const EditModeView = (props: NoticeboardFormProps) => {
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
    widgetData,
    setWidgetData,
  } = props;
  const { theme } = useContext(GlobalContext);

  useEffect(() => {
    setNewWidgetData(widgetObj);
  }, []);

  return (
    widgetObj &&
    newWidgetData && (
      <>
        <ContentCardTitle
          title={`Type: ${props.widgetObj.type?.toUpperCase()} Widget`}
          theme={theme}
          widgetObj={widgetObj}
        />

        {/**
         *  section: TOP INFO
         */}

        <EditWidgetToolbar
          widgetObj={newWidgetData}
          newWidgetData={newWidgetData}
          setNewWidgetData={setNewWidgetData}
          handleActivation={handleActivation}
          handleEditUpdateDefault={handleEditUpdateDefault}
          handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
        />

        {/**
         *  section: TITLE
         */}
        <div className={`mt-2 px-2 `}>
          <Fragment>
            <label htmlFor={widgetObj.id} className="block text-xs font-semibold leading-5 text-gray-700">
              {`Title`}
            </label>
            <input
              type="text"
              id={`${widgetObj.id}`}
              data-basekey={`title`}
              onChange={handleEditUpdateDefault}
              value={newWidgetData.title ? newWidgetData.title : ''}
              className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
              placeholder={widgetObj.title ? widgetObj.title : `Please add title...`}
            />
          </Fragment>
        </div>
        {/**
         *  section: DESCRIPTION
         */}
        {/*<div className={`mt-2 px-2 overflow-ellipsis overflow-hidden ellipsis`}>
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
        </div>*/}
        {/**
         *  section:  CONTENT
         *  - Toggles between differnet edit forms
         */}
        {widgetObj.type === 'default' ? (
          <EditDefaultContent
            widgetObj={newWidgetData}
            setEditorContent={setEditorContent}
            handleActivation={handleActivation}
            handleEditUpdateQuotes={handleEditUpdateQuotes}
            handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
            newWidgetData={newWidgetData}
            setNewWidgetData={setNewWidgetData}
            setWidgetData={setWidgetData}
            viewEditMode={viewEditMode}
            widgetData={widgetData}
          />
        ) : null}
        {
          widgetObj.type === 'quote' ||
          widgetObj.type === 'links' ||
          widgetObj.type === 'call' ||
          widgetObj.type === 'file' ? (
            <EditQuoteContent
              newWidgetData={newWidgetData}
              setNewWidgetData={setNewWidgetData}
              widgetData={widgetData}
              setWidgetData={setWidgetData}
              handleEditUpdateQuotes={handleEditUpdateQuotes}
              handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
              viewEditMode={viewEditMode}
              widgetObj={newWidgetData}
              setEditorContent={setEditorContent}
              handleActivation={handleActivation}
            />
        ) : null}
      </>
    )
  );
};
