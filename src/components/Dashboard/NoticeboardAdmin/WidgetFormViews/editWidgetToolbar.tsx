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

  const toggleClass = `
                transform transition transition-all duration-200 ease-in-out
                rounded bg-blueberry bg-opacity-20`;

  const toggledClass = `translate-x-full`;

  const selectorClass = `rounded border border-medium-gray border-opacity-20`;

  return newWidgetData ? (
    <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>

      {/* STATUS TOGGLE */}
      <div className={`relative mb-2`}>
        <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Widget Status:</p>
        <div className={`relative`}>
          <div
            className={`
                z-50
                ${selectorClass}
                relative flex flex-row h-12 cursor-pointer`} onClick={() => handleActivation(widgetObj.id)}>
            <span className="ml-2 text-xs font-semibold text-green-400">Active</span>
            <span className="ml-2 text-xs font-semibold text-gray-400">Inactive</span>
          </div>

          {/* SLIDEY THING */}
          <div className={` absolute top-0 w-full h-full flex flex-row h-12 `}>
            <span
              className={`
                  z-0
                  ${toggleClass}
                  ${newWidgetData.active ? toggledClass : ''}
                  w-full h-full bg-blueberry`}
            />
            <span className="w-full h-full bg-black bg-opacity-0" />
          </div>
        </div>
      </div>

      {/* PLACEMENT TOGGLE */}
      <div className={`relative mb-2`}>
        <p className={`text-sm font-semibold border-b pb-2 mb-2 ${theme.lessonCard.border}`}>Widget Placement:</p>
        <div className={`relative`}>
          <div className={`
                z-50
                ${selectorClass}
                relative flex flex-row h-12 cursos-pointer`}>
                      <span
                        id={widgetObj.id}
                        onClick={handleEditUpdateDefault}
                        data-basekey={`placement`}
                        data-value={`sidebar`}
                        className="ml-2 text-xs font-semibold text-green-400">
                        Sidebar
                      </span>
                      <span
                        id={widgetObj.id}
                        onClick={handleEditUpdateDefault}
                        data-basekey={`placement`}
                        data-value={`topbar`}
                        className="ml-2 text-xs font-semibold text-gray-400">
                        Topbar
                      </span>
          </div>

          {/* SLIDEY THING */}
          <div className={` absolute top-0 w-full h-full flex flex-row h-12 `}>
            <span
              className={`
                  z-0
                  ${toggleClass}
                  ${newWidgetData.placement !== 'sidebar' ? toggledClass : ''}
                  w-full h-full bg-blueberry`}
            />
            <span className="w-full h-full bg-black bg-opacity-0" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading widget edit toolbar...</p>
  );
};

export default EditWidgetToolbar;
