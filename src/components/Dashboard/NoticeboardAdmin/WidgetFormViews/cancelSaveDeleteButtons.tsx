import React, { useContext } from 'react';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import { AiOutlineDelete } from 'react-icons/all';
import { IconContext } from 'react-icons/lib/esm/iconContext';

const CancelSaveDelete = (props: NoticeboardFormProps) => {
  const { widgetObj, viewEditMode, handleEditToggle } = props;
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);
  return (
    <div className={`flex p-2 mt-2`}>

      <div className={`flex flex-row w-full`}>
      {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
        <p
          onClick={() => handleEditToggle('', '')}
          className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
          {anthologyDict[userLanguage].ACTIONS.CANCEL}
        </p>
      ) : (
        <p
          onClick={() => handleEditToggle('edit', widgetObj.id)}
          className={`w-auto cursor-pointer font-semibold text-blueberry`}>
          {anthologyDict[userLanguage].ACTIONS.EDIT}
        </p>
      )}

      {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
        <>
          <span className={`w-auto mr-2`}>/</span>
          <p
            onClick={() => handleEditToggle('save', widgetObj.id)}
            className={`w-auto cursor-pointer font-semibold text-blueberry`}>
            {anthologyDict[userLanguage].ACTIONS.SAVE}
          </p>
        </>
      ) : null}
      </div>

      {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
        <>
          <div className={`flex flex-row w-auto mr-0 cursor-pointer`} onClick={() => handleEditToggle('delete', widgetObj.id)}>
            <p className={`w-autofont-semibold text-ketchup pointer-events-none`}>
              {anthologyDict[userLanguage].ACTIONS.DELETE}
            </p>
            <IconContext.Provider value={{ className: 'w-auto text-ketchup pointer-events-none ' }}>
              <AiOutlineDelete size={24} />
            </IconContext.Provider>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CancelSaveDelete;
