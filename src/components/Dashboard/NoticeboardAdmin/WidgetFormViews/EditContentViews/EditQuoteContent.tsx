import React, { Fragment, useContext } from 'react';
import { Quote } from '../../../../../interfaces/ClassroomComponentsInterfaces';
import { NoticeboardFormProps } from '../../NoticeboardAdminContent';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineDelete } from 'react-icons/all';
import AddRemoveButton from '../addRemoveButton';

// Standard widget card view
export const EditQuoteContent = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    setNewWidgetData,
    handleEditUpdateQuotes,
  } = props;
  const { theme, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict, noticeboardDict } = useDictionary(clientKey);

  const quoteItem = { text: '', author: '' };
  const callItem = { text: '', url: '' };
  const fileItem = { text: '', url: '' };

  const switchKey = (): {
    key: string;
    key2: string;
    key3: string;
    expander: any;
    label: string;
    label2: string;
    label3: string;
  } => {
    switch (widgetObj.type) {
      case 'quote':
        return {
          key: `quotes`,
          key2: `author`,
          key3: `text`,
          expander: quoteItem,
          label: 'Author',
          label2: 'Quote',
          label3: 'Text',
        };
      case 'call':
        return {
          key: `links`,
          key2: `text`,
          key3: `url`,
          expander: callItem,
          label: 'Link Text',
          label2: 'Url',
          label3: 'Call Link',
        };
      case 'file':
        return {
          key: `links`,
          key2: `text`,
          key3: `url`,
          expander: fileItem,
          label: 'Label',
          label2: 'File Link',
          label3: 'File Link',
        };
      default:
        return null;
    }
  };

  const increaseQuoteCount = () => {
    // if (viewEditMode.mode === 'create') {
    if (true) {
      // @ts-ignore
      setNewWidgetData({
        ...widgetObj,
        [switchKey().key]: [...widgetObj[switchKey().key], switchKey().expander],
      });
    }
  };

  const decreaseQuoteCount = (idx: number) => {
    if (true) {
      const filtered = widgetObj[switchKey().key].filter((linkObj: any, idx1: number) => {
        if (idx1 !== idx) return linkObj;
      });
      setNewWidgetData({
        ...widgetObj,
        [switchKey().key]: filtered,
      });
    }
  };

  const theSwitchObj = switchKey();

  const appendHttp = (inputUrl: string) => {
    const splitUrl = inputUrl.split('://');
    if (splitUrl.length > 1) {
      return `https://${splitUrl[1]}`;
    } else if (splitUrl.length === 1) {
      return `https://${splitUrl[0]}`;
    } else {
      return `https://`;
    }
  };

  return (
    <div className={`mt-2 mb-2 p-2`}>
      {theSwitchObj && theSwitchObj?.key && widgetObj && widgetObj[theSwitchObj?.key].length > 0 ? (
        widgetObj[theSwitchObj?.key].map((widgetQuote: Quote, idx: number) => {
          return (
            <div
              key={`editQuote_${widgetQuote.id}_${idx}`}
              className={`flex flex-row p-2 rounded my-2 ${
                idx % 2 ? 'bg-grayscale-light bg-opacity-20' : 'bg-gray-400 bg-opacity-20'
              }`}>
              <div className={`w-8 m-1`}>
                {/* NUMBER */}
                <div className={`w-6 h-6 p-2 mb-2 rounded-full bg-blueberry flex justify-center items-center`}>
                  <span className={`w-auto h-auto text-center text-white text-lg font-semibold `}>{idx + 1}</span>
                </div>
                {/* TRASH ICON */}
                <div className={`mt-4 cursor-pointer`} onClick={() => decreaseQuoteCount(idx)}>
                  <IconContext.Provider value={{ className: 'w-auto pointer-events-none' }}>
                    <AiOutlineDelete size={24} />
                  </IconContext.Provider>
                </div>
              </div>

              <div className={`w-full`}>
                <div className={`flex flex-row`}>
                  <label
                    htmlFor={`text_${idx}_${widgetObj.id}`}
                    className="w-16 mr-2 leading-7 text-right block text-xs font-semibold leading-5 text-gray-700">
                    {`${theSwitchObj.label}`}
                  </label>

                  <input
                    id={`${widgetObj.id}`}
                    onChange={handleEditUpdateQuotes}
                    data-basekey={`${theSwitchObj.key}`}
                    data-nestkey1={`${theSwitchObj.key2}`}
                    data-nestkey2={idx}
                    className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                    value={
                      widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key2}`]
                        ? widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key2}`]
                        : ''
                    }
                    placeholder={
                      widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key2}`]
                        ? widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key2}`]
                        : `${noticeboardDict[userLanguage].FORM.PLEASE_ADD} ${theSwitchObj.label}...`
                    }
                  />
                </div>

                <div className={`flex flex-col`}>
                  <div className={`flex flex-row`}>
                    <label
                      htmlFor={`text_${idx}_${widgetObj.id}`}
                      className="w-16 mr-2 leading-7 text-right block text-xs font-semibold leading-5 text-gray-700">
                      {`${theSwitchObj.label2}`}
                    </label>

                    <textarea
                      id={`${widgetObj.id}`}
                      onChange={handleEditUpdateQuotes}
                      data-basekey={`${theSwitchObj.key}`}
                      data-nestkey1={`${theSwitchObj.key3}`}
                      data-nestkey2={idx}
                      className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                      value={
                        widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                          ? appendHttp(widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`])
                          : ''
                      }
                      placeholder={
                        widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                          ? widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                          : `${noticeboardDict[userLanguage].FORM.PLEASE_ADD} ${theSwitchObj.label2}...`
                      }
                      rows={2}
                    />
                  </div>
                  {/* EXAMPLE URL */}
                  <p className={`text-center w-full ${theme.lessonCard.subtitle}`}>
                    {widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                      ? appendHttp(widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`])
                      : 'https://'}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <>
          <p>No quotes added...</p>
        </>
      )}
      <AddRemoveButton clickFunction={increaseQuoteCount} label={anthologyDict[userLanguage].ACTIONS.ADD} />
    </div>
  );
};
