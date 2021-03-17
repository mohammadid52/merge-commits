import React, { Fragment, useContext } from 'react';
import { Quote } from '../../../../../interfaces/ClassroomComponentsInterfaces';
import { NoticeboardFormProps } from '../../NoticeboardAdminContent';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';

// Standard widget card view
export const EditQuoteContent = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    setEditorContent,
    viewEditMode,
    setNewWidgetData,
    widgetData,
    setWidgetData,
    handleEditUpdateQuotes,
  } = props;
  const { state, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);

  const quoteItem = { text: '', author: '' };
  const callItem = { text: '', url: '' };

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
      default:
        return null;
    }
  };

  const increaseQuoteCount = () => {
    if (viewEditMode.mode === 'create') {
      // @ts-ignore
      setNewWidgetData({ ...widgetObj, [switchKey().key]: [...widgetObj[switchKey().key], switchKey().expander] });
    }
    if (viewEditMode.mode === 'edit') {
      const updatedWidgetArray = widgetData.map((nestedObj: any, idx: number) => {
        if (nestedObj.id === widgetObj.id) {
          return { ...nestedObj, [switchKey().key]: [...nestedObj[switchKey().key], switchKey().expander] };
        } else {
          return nestedObj;
        }
      });
      setWidgetData(updatedWidgetArray);
    }
  };

  const theSwitchObj = switchKey();

  return (
    <div className={`mt-2 mb-2`}>
      {widgetObj[theSwitchObj.key].length > 0 ? (
        widgetObj[theSwitchObj.key].map((widgetQuote: Quote, idx: number) => {
          return (
            <div className={`flex flex-row p-2 rounded my-2 ${idx % 2 ? 'bg-grayscale-light bg-opacity-20' : 'bg-gray-400 bg-opacity-20'}`}>
              <div className={`w-8`}>
                <p className={`text-xl font-bold`}>{idx}.</p>
              </div>
              <div className={`w-full`}>
                <label
                  htmlFor={`text_${idx}_${widgetObj.id}`}
                  className="block text-xs font-semibold leading-5 text-gray-700">
                  {`${theSwitchObj.label} #${idx}`}
                </label>

                <textarea
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
                      : `Please add ${theSwitchObj.label}...`
                  }
                  rows={1}
                />

                <label
                  htmlFor={`text_${idx}_${widgetObj.id}`}
                  className="block text-xs font-semibold leading-5 text-gray-700">
                  {`${theSwitchObj.label2} #${idx}`}
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
                      ? widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                      : ''
                  }
                  placeholder={
                    widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                      ? widgetObj[`${theSwitchObj.key}`][idx][`${theSwitchObj.key3}`]
                      : `Please add ${theSwitchObj.label2}...`
                  }
                  rows={2}
                />
              </div>
            </div>
          );
        })
      ) : (
        <>
          <p>No quotes added...</p>
        </>
      )}
      <p onClick={increaseQuoteCount} className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
        {anthologyDict[userLanguage].ACTIONS.CREATE}?
      </p>
    </div>
  );
};
