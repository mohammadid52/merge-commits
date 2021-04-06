import React, { useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { GrBlockQuote } from 'react-icons/gr';
import { GoTextSize } from 'react-icons/go';
import { AiOutlineFileZip, AiOutlinePhone } from 'react-icons/ai';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import useDictionary from '../../../../customHooks/dictionary';

const CreateWidgetToolbar = (props: NoticeboardFormProps) => {
  const { theme,clientKey, userLanguage } = useContext(GlobalContext);
  const {noticeboardDict} = useDictionary(clientKey);
  const { widgetObj, handleEditUpdateWYSIWYG } = props;

  const statusOptions = [
    {
      value: true,
      label: noticeboardDict[userLanguage].FORM.ACTIVE,
    },
    {
      value: false,
      label: noticeboardDict[userLanguage].FORM.INACTIVE,
    },
  ];

  const placementOptions = [
    {
      location: 'sidebar',
      label: noticeboardDict[userLanguage].FORM.IN_SIDEBAR,
    },
    {
      location: 'topbar',
      label: noticeboardDict[userLanguage].FORM.ABOVE_LESSONS,
    },
  ];

  const widgetOptions = [
    {
      type: 'default',
      label: 'Text',
      description: noticeboardDict[userLanguage].WIDGET_DESCRIPTION.TEXT,
    },
    {
      type: 'quote',
      label: 'Quotes',
      description: noticeboardDict[userLanguage].WIDGET_DESCRIPTION.QUOTES,
    },
    {
      type: 'call',
      label: 'Call',
      description: noticeboardDict[userLanguage].WIDGET_DESCRIPTION.CALL,
    },
    {
      type: 'file',
      label: 'Files',
      description: noticeboardDict[userLanguage].WIDGET_DESCRIPTION.FILE,
    },
  ];

  const switchIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <AiOutlinePhone />;
      case 'quote':
        return <GrBlockQuote />;
      case 'default':
        return <GoTextSize />;
      case 'file':
        return <AiOutlineFileZip />
      default:
        return null;
    }
  };

  const selectorClass = `p-2 rounded  border-0 border-medium-gray border-opacity-20`;

  return (
    <div className={`flex flex-col p-2 mb-2`}>

      <div className={`grid grid-cols-2 gap-2`}>
      <div className={`mb-2`}>
        <p className={`text-sm font-semibold border-b-0 pb-2 mb-2 ${theme.lessonCard.border}`}>{noticeboardDict[userLanguage].FORM.WIDGET_STATUS}:</p>
        <div className={`grid grid-cols-2 gap-2 ${theme.lessonCard.subtitle}`}>
          {statusOptions.map((option: any, idx: number) => (
            <div
              key={`statusOption_${idx}`}
              className={`
              ${selectorClass}
              ${widgetObj.active === option.value && option.value === true ? 'text-white font-semibold bg-sea-green' : ''}
              ${widgetObj.active === option.value && option.value === false ? 'text-white font-semibold bg-ketchup' : ''}
            `}
              onClick={() => handleEditUpdateWYSIWYG('active', option.value, 'active', '', '')}>
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <div className={`mb-2`}>
        <p className={`text-sm font-semibold border-b-0 pb-2 mb-2 ${theme.lessonCard.border}`}>{noticeboardDict[userLanguage].FORM.PLACEMENT}:</p>
        <div className={`grid grid-cols-2 gap-2 ${theme.lessonCard.subtitle}`}>
          {placementOptions.map((option: any, idx: number) => (
            <div
              key={`placementOption_${idx}`}
              className={`
              ${selectorClass}
              ${widgetObj.placement === option.location ? 'text-white font-semibold bg-blueberry' : ''}
            `}
              data-basekey="placement"
              onClick={() => handleEditUpdateWYSIWYG('placement', option.location, 'placement', '', '')}>
              {option.label}
            </div>
          ))}
        </div>
      </div>
      </div>

      <div className={`mb-2`}>
        <p className={`text-sm font-semibold border-b-0 pb-2 mb-2 ${theme.lessonCard.border}`}>{noticeboardDict[userLanguage].FORM.TYPE}:</p>
        <div className={`grid grid-cols-4 gap-2 ${theme.lessonCard.subtitle}`}>
          {widgetOptions.map((option: any, idx: number) => (
            <>
              <div
                key={`typeOption_${idx}`}
                className={`
                cursor-pointer
                ${selectorClass}
                ${widgetObj.type === option.type ? 'text-white font-semibold bg-blueberry' : ''}
                `}
                data-basekey="type"
                onClick={() => handleEditUpdateWYSIWYG('type', option.type, 'type', '', '')}>
                <p className={`underline`}>
                  {option.label}
                  <span>
                    <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
                      {switchIcon(option.type)}
                    </IconContext.Provider>
                  </span>
                </p>
                <p className={`pt-2 text-xs text-gray-400`}>{option.description}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateWidgetToolbar;
