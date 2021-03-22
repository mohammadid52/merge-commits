import React, { useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { GrBlockQuote } from 'react-icons/gr';
import { GoTextSize } from 'react-icons/go';
import { AiOutlinePhone } from 'react-icons/ai';
import { IconContext } from 'react-icons/lib/esm/iconContext';

const CreateWidgetToolbar = (props: NoticeboardFormProps) => {
  const { state, theme } = useContext(GlobalContext);
  const { widgetObj, handleEditUpdateDefault, handleEditUpdateWYSIWYG } = props;

  const statusOptions = [
    {
      value: true,
      label: 'Active',
    },
    {
      value: false,
      label: 'Inactive',
    },
  ];

  const placementOptions = [
    {
      location: 'sidebar',
      label: 'In the Sidebar',
    },
    {
      location: 'topbar',
      label: 'Above the Lessons',
    },
  ];

  const widgetOptions = [
    {
      type: 'default',
      label: 'Text',
      description:
        'This is the default text widget. Use this if you want to show a text message/notice to students in your room.',
    },
    {
      type: 'quote',
      label: 'Quotes',
      description: 'Add multiple quotes above the lessons or to the side widget bar to inspire your students.',
    },
    {
      type: 'call',
      label: 'Call',
      description:
        "This is a basic widget to post the zoom/meet/teams links you'll use to communicate with your students.",
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
      default:
        return null;
    }
  };

  const selectorClass = `p-2 rounded border border-medium-gray border-opacity-20`;

  return (
    <div className={`flex flex-col p-2 mb-2`}>

      <div className={`grid grid-cols-2 gap-2`}>
      <div className={`mb-2`}>
        <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Widget Status:</p>
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
        <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Placement:</p>
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
        <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Type:</p>
        <div className={`grid grid-cols-4 gap-2 ${theme.lessonCard.subtitle}`}>
          {widgetOptions.map((option: any, idx: number) => (
            <>
              <div
                key={`typeOption_${idx}`}
                className={`
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
