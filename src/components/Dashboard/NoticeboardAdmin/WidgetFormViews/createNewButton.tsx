import React, { useContext } from 'react';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import { AiFillPlusCircle } from 'react-icons/all';
import { IconContext } from 'react-icons/lib/esm/iconContext';

const CreateNewButton = (props: NoticeboardFormProps) => {
  const { subSection, viewEditMode, handleEditToggle, widgetObj } = props;
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);
  return (
    <div className={`flex p-2 ${viewEditMode.mode === 'create' ? 'mt-2' : ''}`}>
      {viewEditMode.mode === 'create' && viewEditMode.widgetID === widgetObj.widgetID ? (
        <p
          onClick={() => handleEditToggle('', '')}
          className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
          {anthologyDict[userLanguage].ACTIONS.CANCEL}
        </p>
      ) : (
        <div
          className={`flex flex-row w-auto mr-0 cursor-pointer`}
          onClick={() => handleEditToggle('create', widgetObj.widgetID)}>
          <p className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
            {anthologyDict[userLanguage].ACTIONS.CREATE}
          </p>
          <IconContext.Provider value={{ className: 'w-auto text-blueberry pointer-events-none ' }}>
            <AiFillPlusCircle size={24} />
          </IconContext.Provider>
        </div>
      )}
      {viewEditMode.mode === 'create' && viewEditMode.widgetID === widgetObj.widgetID ? (
        <>
          <span className={`w-auto mr-2`}>/</span>
          <p
            onClick={() => handleEditToggle('savenew', `custom_${subSection}`)}
            className={`w-auto cursor-pointer font-semibold text-blueberry`}>
            {anthologyDict[userLanguage].ACTIONS.SAVE}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default CreateNewButton;
