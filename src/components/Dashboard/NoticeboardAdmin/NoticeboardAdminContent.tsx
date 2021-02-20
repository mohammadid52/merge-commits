import React, { Fragment, useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ContentCard from '../../Atoms/ContentCard';
import FormInput from '../../Atoms/Form/FormInput';
import TextArea from '../../Atoms/Form/TextArea';
import { dateFromServer } from '../../../utilities/time';
import useDictionary from '../../../customHooks/dictionary';
import { NoticeboardWidgetMapItem, Quote, ViewEditMode } from './NoticeboardAdmin';

interface NoticeboardContentCardProps {
  viewEditMode: ViewEditMode;
  handleEditToggle: (editMode: string, studentDataID: string) => void;
  handleEditUpdate: (e: React.ChangeEvent) => void;
  handleActivation: (id: string) => void;
  subSection: string;
  content?: any
}

const NoticeboardContent = (props: NoticeboardContentCardProps) => {
  const { viewEditMode, handleEditToggle, handleEditUpdate, handleActivation, subSection, content } = props;
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);

  // Standard widget card view
  const viewModeView = (widgetObj: NoticeboardWidgetMapItem) => (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        <span className={`text-left ${theme.lessonCard.subtitle}`}>
          Widget Status:
          {
            widgetObj.active ?
              (
                <span
                  className='ml-2 text-xs font-semibold text-green-400'>Active</span>
              ) :
              (
                <span
                  className='ml-2 text-xs font-semibold text-gray-400'>Inactive</span>
              )
          }
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>Placement: {widgetObj.placement}</span>
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
        <span className={`text-left ${theme.lessonCard.subtitle}`}>
          Widget Status:
          {
            widgetObj.active ?
              (
                <span className='ml-2 text-xs font-semibold text-green-400'>Active</span>
              ) :
              (
                <span className='ml-2 text-xs font-semibold text-gray-400'>Inactive</span>
              )
          }
        </span>
        <span className={`text-center ${theme.lessonCard.subtitle}`}>
          {
            widgetObj.active ?
              (
                <span onClick={() => handleActivation(widgetObj.id)}
                      className='ml-2 cursor-pointer text-base text-ketchup font-semibold'>Deactivate</span>
              ) :
              (
                <span onClick={() => handleActivation(widgetObj.id)}
                      className='ml-2 cursor-pointer text-base text-blueberry font-semibold'>Activate</span>
              )
          }
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>Placement: {widgetObj.placement}</span>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={`mt-2 `}>
        <Fragment>
          <label htmlFor={widgetObj.id} className='block text-xs font-semibold leading-5 text-gray-700'>
            {`Title`}
          </label>
          <input
            type='text'
            id={`${widgetObj.id}`}
            data-basekey={`title`}
            onChange={handleEditUpdate}
            value={widgetObj.title ? widgetObj.title : ''}
            className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
            placeholder={widgetObj.title ? widgetObj.title : `Please add title...`} />
        </Fragment>
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      <div className={`mt-2 overflow-ellipsis overflow-hidden ellipsis`}>
        <Fragment>
          <label htmlFor={widgetObj.id} className='block text-xs font-semibold leading-5 text-gray-700'>
            {`Description`}
          </label>
          <input
            type='text'
            id={`${widgetObj.id}`}
            data-basekey={`description`}
            onChange={handleEditUpdate}
            value={widgetObj.description ? widgetObj.description : ''}
            className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
            placeholder={widgetObj.description ? widgetObj.description : `Please add title...`} />
        </Fragment>
      </div>
      {/**
       *  section:  CONTENT
       */}
      {
        widgetObj.type === 'default' ?
          editDefaultContent(widgetObj) :
          null
      }
      {
        widgetObj.type === 'quote' ?
          editQuoteContent(widgetObj) :
          null
      }
    </>
  );

  const editDefaultContent = (widgetObj: NoticeboardWidgetMapItem) => (
    <div className={`mt-2 mb-2`}>
      <Fragment>
        <label htmlFor={`${widgetObj.id}`}
               className='block text-xs font-semibold leading-5 text-gray-700'>
          {`Content`}
        </label>
        <textarea
          id={`${widgetObj.id}`}
          onChange={handleEditUpdate}
          data-basekey={`content`}
          data-nestkey1={`text`}
          className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
          value={widgetObj.content.text ? widgetObj.content.text : ''}
          placeholder={widgetObj.content.text ? widgetObj.content.text : `Please add quote...`}
          rows={5}
        />
      </Fragment>
    </div>
  );

  const editQuoteContent = (widgetObj: NoticeboardWidgetMapItem) => (
    <div className={`mt-2 mb-2`}>
      {
        widgetObj.quotes.length > 0 ?
          (
            widgetObj.quotes.map((widgetQuote: Quote, idx: number) => (
              <Fragment>
                <label htmlFor={`text_${idx}_${widgetObj.id}`}
                       className='block text-xs font-semibold leading-5 text-gray-700'>
                  {`Quotes`}
                </label>
                <textarea
                  id={`${widgetObj.id}`}
                  onChange={handleEditUpdate}
                  data-basekey={`quotes`}
                  data-nestkey1={`text`}
                  data-nestkey2={idx}
                  className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                  value={widgetObj.quotes[idx].text ? widgetObj.quotes[idx].text : ''}
                  placeholder={widgetObj.quotes[idx].text ? widgetObj.quotes[idx].text : `Please add quote...`}
                  rows={5}
                />
              </Fragment>
            ))
          ) :
          null
      }
    </div>
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