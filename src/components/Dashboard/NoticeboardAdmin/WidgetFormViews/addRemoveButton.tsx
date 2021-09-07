import React from 'react';
import {AiFillPlusCircle} from 'react-icons/all';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {NoticeboardFormProps} from '../NoticeboardAdminContent';

const AddRemoveButton = (props: NoticeboardFormProps) => {
  const {label, clickFunction} = props;
  return (
    <div className={`flex p-2`}>
      <div className={`flex flex-row w-auto mr-0 cursor-pointer`} onClick={clickFunction}>
        <p className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
          {label}
        </p>
        <IconContext.Provider
          value={{className: 'w-auto text-blueberry pointer-events-none '}}>
          <AiFillPlusCircle size={24} />
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default AddRemoveButton;
