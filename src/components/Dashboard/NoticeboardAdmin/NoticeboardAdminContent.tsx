import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import FormInput from '../../Atoms/Form/FormInput';
import TextArea from '../../Atoms/Form/TextArea';
import { dateFromServer } from '../../../utilities/time';
import useDictionary from '../../../customHooks/dictionary';
import { NoticeboardWidgetMapItem, ViewEditMode } from './NoticeboardAdmin';

interface NoticeboardContentCardProps {
  viewEditMode: ViewEditMode;
  handleEditToggle: (editMode: string, studentDataID: string) => void;
  handleEditUpdate: (e: React.ChangeEvent) => void;
  subSection: string;
  content?: any
}

const NoticeboardContent = (props: NoticeboardContentCardProps) => {
  const { viewEditMode, handleEditToggle, handleEditUpdate, subSection, content } = props;
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);

  // Standard widget card view
  const viewModeView = (widgetObj: NoticeboardWidgetMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        <p className={`text-left ${theme.lessonCard.subtitle}`}>Widget Info: -</p>
        <p className={`text-right ${theme.lessonCard.subtitle}`}>Placement: {widgetObj.placement}</p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <h4
          className={`w-auto ${theme.lessonCard.title}`}>{widgetObj.title ? widgetObj.title : `Untitled widget`}</h4>
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`overflow-ellipsis overflow-hidden ellipsis`}>
        {widgetObj.description ?
          widgetObj.description :
          `No description`}
      </div>
    </>
  );

  // Edit standard widget card view
  const editModeView = (widgetObj: NoticeboardWidgetMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        <p className={`text-left ${theme.lessonCard.subtitle}`}>Widget Info: -</p>
        <p className={`text-right ${theme.lessonCard.subtitle}`}>Placement: {widgetObj.placement}</p>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={`mt-2 `}>
        <FormInput
          id={`title_${widgetObj.placement}_${widgetObj.id}`}
          label={`Title`}
          onChange={handleEditUpdate}
          value={widgetObj.title}
          placeHolder={widgetObj.title ? widgetObj.title : `Please add title...`}
        />
      </div>
    </>
  );

  return (
    <>
      {
        content.length > 0 ?
          (
            content.map((widgetObj: NoticeboardWidgetMapItem, idx: number) => {
              return (<ContentCard key={`noticeboardwidget_${subSection}${idx}`}>
                <div id={widgetObj.id} className={`flex flex-col p-2`}>
                  {
                    viewEditMode && viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ?
                    editModeView(widgetObj):
                    viewModeView(widgetObj)
                  }
                  {/**
                   *  section:  VIEW/EDIT BUTTON
                   */}
                  <div className={`flex pt-2 mt-2`}>
                    {
                      viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ?
                        (
                          <p onClick={() => handleEditToggle('', '')}
                             className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.CANCEL}</p>
                        ) :
                        (
                          <p onClick={() => handleEditToggle('edit', widgetObj.id)}
                             className={`w-auto cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.EDIT}</p>
                        )
                    }
                    {
                      viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ?
                        (
                          <>
                            <span className={`w-auto mr-2`}>/</span>
                            <p onClick={() => handleEditToggle('save', widgetObj.id)}
                               className={`w-auto cursor-pointer font-semibold text-blueberry`}>{anthologyDict[userLanguage].ACTIONS.SAVE}</p>
                          </>
                        ) :
                        null
                    }
                  </div>
                </div>
              </ContentCard>);
            })
          ) :
          null
      }
    </>
  );
};

export default NoticeboardContent;