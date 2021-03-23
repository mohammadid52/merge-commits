import React, { useContext } from 'react';
import { NoticeboardFormProps } from '../NoticeboardAdminContent';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSave, AiOutlineStop } from 'react-icons/all';
import Buttons from '../../../Atoms/Buttons';

const CancelSaveDelete = (props: NoticeboardFormProps) => {
  const { widgetObj, viewEditMode, handleEditToggle, resetNewWidgetData } = props;
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);

  const handleCancel = () =>{
    resetNewWidgetData();
  }

  return (
    <div className={`flex p-2 mt-2`}>
      <div className={`flex flex-row w-full`}>
        {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
          <Buttons
            onClick={handleCancel}
            label={anthologyDict[userLanguage].ACTIONS.CANCEL}
            type={`button`}
            Icon={AiOutlineStop}
            btnClass={`mr-4`}
          />
        ) : (
          <Buttons
            onClick={() => handleEditToggle('edit', widgetObj.id)}
            label={anthologyDict[userLanguage].ACTIONS.EDIT}
            type={`button`}
            Icon={AiOutlineEdit}
          />
        )}

        {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
          <>
            <Buttons
              onClick={() => handleEditToggle('save', widgetObj.id)}
              label={anthologyDict[userLanguage].ACTIONS.SAVE}
              type={`button`}
              Icon={AiOutlineSave}
            />
          </>
        ) : null}
      </div>

      {viewEditMode.mode === 'edit' && viewEditMode.widgetID === widgetObj.id ? (
        <>
          <Buttons
            onClick={() => handleEditToggle('delete', widgetObj.id)}
            label={anthologyDict[userLanguage].ACTIONS.DELETE}
            type={`button`}
            Icon={AiOutlineDelete}
            btnClass={`bg-ketchup`}
          />
        </>
      ) : null}
    </div>
  );
};

export default CancelSaveDelete;
