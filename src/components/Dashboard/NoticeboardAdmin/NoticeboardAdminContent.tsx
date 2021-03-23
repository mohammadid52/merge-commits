import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import useDictionary from '../../../customHooks/dictionary';
import { ViewEditMode } from './NoticeboardAdmin';
import { Widget as NoticeboardWidgetMapItem } from '../../../interfaces/ClassroomComponentsInterfaces';
import { ViewModeView } from './WidgetFormViews/viewWidget';
import { EditModeView } from './WidgetFormViews/editWidget';
import { CreateModeView } from './WidgetFormViews/createWidget';
import CancelSaveDelete from './WidgetFormViews/cancelSaveDeleteButtons';
import CreateNewButton from './WidgetFormViews/createNewButton';
import { create } from 'domain';

export interface NoticeboardContentCardProps {
  activeRoom?: string;
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
  initialNewWidgetData?: any;
  newWidgetData?: any;
  setNewWidgetData?: any;
  content?: any;
  setEditorContent?: (html: string, text: string, idKey: string) => void;
}

export interface NoticeboardFormProps {
  activeRoom?: string;
  subSection?: string;
  widgetObj?: NoticeboardWidgetMapItem;
  setEditorContent?: any;
  handleActivation?: any;
  handleEditUpdateDefault?: any;
  handleEditUpdateWYSIWYG?: any;
  handleEditUpdateQuotes?: (e: React.ChangeEvent<Element>) => void;
  viewEditMode?: { widgetID?: string; mode: string };
  resetNewWidgetData?: ()=>void;
  newWidgetData?: NoticeboardWidgetMapItem;
  setNewWidgetData?: React.Dispatch<React.SetStateAction<NoticeboardWidgetMapItem>>;
  widgetData?: any;
  setWidgetData?: React.Dispatch<React.SetStateAction<NoticeboardWidgetMapItem[]>>;
  handleEditToggle?: (
    editMode: 'view' | 'edit' | 'save' | 'create' | 'delete' | 'savenew' | '',
    widgetID: string
  ) => void;
  clickFunction?: (param?: any) => any;
  label?: string;
}

const NoticeboardContent = (props: NoticeboardContentCardProps) => {
  const {
    activeRoom,
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
    initialNewWidgetData,
    newWidgetData,
    setNewWidgetData,
    content,
  } = props;
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict, classRoomDict } = useDictionary(clientKey);

  const resetNewWidgetData = ():void => {
    setNewWidgetData(initialNewWidgetData);
  }

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
                handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
                setEditorContent={setEditorContent}
                handleActivation={handleActivation}
                resetNewWidgetData={resetNewWidgetData}
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
            {activeRoom ? (
              <CreateNewButton
                subSection={subSection}
                widgetObj={createTemplate}
                viewEditMode={viewEditMode}
                handleEditToggle={handleEditToggle}
              />
            ) : (
              <>⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_CLASSROOM_WIDGETS}...</>
            )}
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
                    <>
                    <EditModeView
                      widgetObj={widgetObj}
                      viewEditMode={viewEditMode}
                      handleEditUpdateDefault={handleEditUpdateDefault}
                      handleEditUpdateQuotes={handleEditUpdateQuotes}
                      handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
                      handleActivation={handleActivation}
                      setEditorContent={setEditorContent}
                      resetNewWidgetData={resetNewWidgetData}
                      newWidgetData={newWidgetData}
                      setNewWidgetData={setNewWidgetData}
                      setWidgetData={setWidgetData}
                      widgetData={widgetData}
                    />
                    </>
                  ) : (
                    <ViewModeView widgetObj={widgetObj} />
                  )}

                  {/**
                   *  section:  VIEW/EDIT BUTTON
                   */}
                  <CancelSaveDelete
                    handleEditToggle={handleEditToggle}
                    widgetObj={widgetObj}
                    viewEditMode={viewEditMode}
                  />
                </div>
              </ContentCard>
            );
          })
        : null}
    </>
  );
};

export default NoticeboardContent;
