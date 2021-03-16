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

  const increaseQuoteCount = () => {
    if (viewEditMode.mode === 'create') {
      setNewWidgetData({ ...widgetObj, quotes: [...widgetObj.quotes, { text: '', author: '' }] });
    }
    if (viewEditMode.mode === 'edit') {
      const updatedWidgetArray = widgetData.map((nestedObj: any, idx: number) => {
        if (nestedObj.id === widgetObj.id) {
          return { ...nestedObj, quotes: [...nestedObj.quotes, { text: '', author: '' }] };
        } else {
          return nestedObj;
        }
      });
      setWidgetData(updatedWidgetArray);
    }
  };

  return (
    <div className={`mt-2 mb-2`}>
      {widgetObj.quotes.length > 0 ? (
        widgetObj.quotes.map((widgetQuote: Quote, idx: number) => {
          return (
            <Fragment>
              <label
                htmlFor={`text_${idx}_${widgetObj.id}`}
                className="block text-xs font-semibold leading-5 text-gray-700">
                {`Author #${idx}`}
              </label>

              <textarea
                id={`${widgetObj.id}`}
                onChange={handleEditUpdateQuotes}
                data-basekey={`quotes`}
                data-nestkey1={`author`}
                data-nestkey2={idx}
                className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                value={widgetObj.quotes[idx].author ? widgetObj.quotes[idx].author : ''}
                placeholder={widgetObj.quotes[idx].author ? widgetObj.quotes[idx].author : `Please add author...`}
                rows={1}
              />

              <label
                htmlFor={`text_${idx}_${widgetObj.id}`}
                className="block text-xs font-semibold leading-5 text-gray-700">
                {`Quote #${idx}`}
              </label>

              <textarea
                id={`${widgetObj.id}`}
                onChange={handleEditUpdateQuotes}
                data-basekey={`quotes`}
                data-nestkey1={`text`}
                data-nestkey2={idx}
                className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                value={widgetObj.quotes[idx].text ? widgetObj.quotes[idx].text : ''}
                placeholder={widgetObj.quotes[idx].text ? widgetObj.quotes[idx].text : `Please add quote...`}
                rows={2}
              />
            </Fragment>
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
