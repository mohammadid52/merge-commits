import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';

const EditWidgetToolbar = (props: NoticeboardFormProps) => {
  const {
    widgetObj,
    newWidgetData,
    setNewWidgetData,
    handleActivation,
    handleEditUpdateDefault,
    handleEditUpdateWYSIWYG,
  } = props;
  const { theme } = useContext(GlobalContext);

  const selectorClass = `p-2 rounded border border-medium-gray border-opacity-20`;

  return newWidgetData ? (
    <div className={`flex flex-col p-2 mb-2`}>

      <div className={`grid grid-cols-2 gap-2`}>

        {/* STATUS TOGGLE */}
        <div className={`mb-2`}>
          <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Widget Status:</p>
          <div
            className={`
                z-50  grid grid-cols-2 gap-2 cursor-pointer ${theme.lessonCard.subtitle}`}
            onClick={() => handleActivation(widgetObj.id)}>
            <div
              className={`
              ${selectorClass}
              ${widgetObj.active ? 'text-white font-semibold bg-sea-green' : ''}
            p-2  text-sm font-semibold`}>
              Active
            </div>
            <div
              className={`
              ${selectorClass}
              ${!widgetObj.active ? 'text-white font-semibold bg-ketchup' : ''}
            p-2  text-sm font-semibold`}>
              Inactive
            </div>
          </div>
        </div>

        {/* PLACEMENT TOGGLE */}
        <div className={`mb-2`}>
          <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Widget Placement:</p>
          <div className={`grid grid-cols-2 gap-2 ${theme.lessonCard.subtitle}`}>
            <div
              id={widgetObj.id}
              onClick={handleEditUpdateDefault}
              data-basekey={`placement`}
              data-value={`sidebar`}
              className={`
              ${selectorClass}
              ${widgetObj.placement === 'sidebar' ? 'text-white font-semibold bg-blueberry' : ''}
              p-2  text-sm font-semibold`}>
              Sidebar
            </div>
            <div
              id={widgetObj.id}
              onClick={handleEditUpdateDefault}
              data-basekey={`placement`}
              data-value={`topbar`}
              className={`
              ${selectorClass}
              ${widgetObj.placement === 'topbar' ? 'text-white font-semibold bg-blueberry' : ''}
              p-2  text-sm font-semibold`}>
              Topbar
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading widget edit toolbar...</p>
  );
};

export default EditWidgetToolbar;
