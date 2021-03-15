import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import useDictionary from '../../../customHooks/dictionary';
import { NoticeboardWidgetMapItem, ViewEditMode } from './NoticeboardAdmin';
import { ViewModeView } from './WidgetFormViews/viewWidget';
import { EditModeView } from './WidgetFormViews/editWidget';
import { CreateModeView } from './WidgetFormViews/createWidget';

export interface NoticeboardContentCardProps {
  viewEditMode?: ViewEditMode;
  handleEditToggle?: (editMode: string, widgetID: string) => void;
  handleEditUpdateDefault?: (e: React.ChangeEvent) => void;
  handleEditUpdateQuotes?: (e: React.ChangeEvent) => void;
  handleEditUpdateWYSIWYG?: (id: string, value: string, basekey: string, nestkey1: string, nestkey2: string) => void;
  handleActivation?: (id: string) => void;
  subSection?: string;
  widgetData?: any;
  setWidgetData?: any;
  createTemplate?: any;
  newWidgetData?: any;
  setNewWidgetData?: any;
  content?: any;
  setEditorContent?: (html: string, text: string, idKey: string) => void;
}

export interface NoticeboardFormProps {
  widgetObj: NoticeboardWidgetMapItem;
  setEditorContent: any;
  handleActivation: any;
  handleEditUpdateDefault?: any;
  handleEditUpdateQuotes?: (e: React.ChangeEvent<Element>) => void;
  viewEditMode: { widgetID?: string; mode: string };
  newWidgetData: NoticeboardWidgetMapItem;
  setNewWidgetData: React.Dispatch<React.SetStateAction<NoticeboardWidgetMapItem>>;
  widgetData: any;
  setWidgetData: React.Dispatch<React.SetStateAction<NoticeboardWidgetMapItem[]>>;
}

const NoticeboardContent = (props: NoticeboardContentCardProps) => {
  const {
    viewEditMode,
    handleEditToggle,
    handleEditUpdateDefault,
    handleEditUpdateQuotes,
    handleEditUpdateWYSIWYG,
    handleActivation,
    subSection,
    widgetData,
    setWidgetData,
    createTemplate,
    newWidgetData,
    setNewWidgetData,
    content,
  } = props;
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);

  const setEditorContent = (html: string, text: string, idKey: string) => {
    handleEditUpdateWYSIWYG(idKey, html, 'content', 'text', '');
  };

  return (
    <>
      {
        <ContentCard>
          {/**
           * CREATE WIDGET VIEW
           */}

          <div id={`anthology_${subSection}_create`} className={`flex flex-col p-2`}>
            {viewEditMode && viewEditMode.mode === 'create' ? (
              <CreateModeView
                viewEditMode={viewEditMode}
                handleEditUpdateDefault={handleEditUpdateDefault}
                handleEditUpdateQuotes={handleEditUpdateQuotes}
                setEditorContent={setEditorContent}
                handleActivation={handleActivation}
                newWidgetData={newWidgetData}
                setNewWidgetData={setNewWidgetData}
                setWidgetData={setWidgetData}
                widgetData={widgetData}
                widgetObj={createTemplate}
              />
            ) : null}

            {/**
             *  section:  VIEW/EDIT BUTTON
             */}
            <div className={`flex ${viewEditMode.mode === 'create' ? 'pt-2 mt-2' : ''}`}>
              {viewEditMode.mode === 'create' && viewEditMode.widgetID === createTemplate.widgetID ? (
                <p
                  onClick={() => handleEditToggle('', '')}
                  className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
                  {anthologyDict[userLanguage].ACTIONS.CANCEL}
                </p>
              ) : (
                <p
                  onClick={() => handleEditToggle('create', createTemplate.widgetID)}
                  className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
                  {anthologyDict[userLanguage].ACTIONS.CREATE}
                </p>
              )}
              {viewEditMode.mode === 'create' && viewEditMode.widgetID === createTemplate.widgetID ? (
                <>
                  <span className={`w-auto mr-2`}>/</span>
                  <p
                    onClick={() => handleEditToggle('savenew', `custom_${subSection}`)}
                    className={`w-auto cursor-pointer font-semibold text-blueberry`}>
                    {anthologyDict[userLanguage].ACTIONS.SAVE}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </ContentCard>
      }

      {/**
       * LIST WIDGETS VIEW
       *    Toggleable
       *    - EDIT VIEW (edit widget details)
       *    - STATIC VIEW (simpled widget display)
       */}
      {content.length > 0
        ? content.map((widgetObj: NoticeboardWidgetMapItem, idx: number) => {
            return (
              <ContentCard key={`noticeboardwidget_${subSection}${idx}`}>
                <div id={widgetObj.id} className={`flex flex-col p-2`}>
                  {viewEditMode && viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
                    <EditModeView
                      widgetObj={widgetObj}
                      viewEditMode={viewEditMode}
                      handleEditUpdateDefault={handleEditUpdateDefault}
                      handleEditUpdateQuotes={handleEditUpdateQuotes}
                      handleActivation={handleActivation}
                      setEditorContent={setEditorContent}
                      newWidgetData={newWidgetData}
                      setNewWidgetData={setNewWidgetData}
                      setWidgetData={setWidgetData}
                      widgetData={widgetData}
                    />
                  ) : (
                    <ViewModeView widgetObj={widgetObj} />
                  )}

                  {/**
                   *  section:  VIEW/EDIT BUTTON
                   */}
                  <div className={`flex pt-2 mt-2`}>
                    {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
                      <p
                        onClick={() => handleEditToggle('', '')}
                        className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
                        {anthologyDict[userLanguage].ACTIONS.CANCEL}
                      </p>
                    ) : (
                      <p
                        onClick={() => handleEditToggle('edit', widgetObj.id)}
                        className={`w-auto cursor-pointer font-semibold text-blueberry`}>
                        {anthologyDict[userLanguage].ACTIONS.EDIT}
                      </p>
                    )}
                    {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
                      <>
                        <span className={`w-auto mr-2`}>/</span>
                        <p
                          onClick={() => handleEditToggle('save', widgetObj.id)}
                          className={`w-auto cursor-pointer font-semibold text-blueberry`}>
                          {anthologyDict[userLanguage].ACTIONS.SAVE}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
              </ContentCard>
            );
          })
        : null}
    </>
  );
};

export default NoticeboardContent;
