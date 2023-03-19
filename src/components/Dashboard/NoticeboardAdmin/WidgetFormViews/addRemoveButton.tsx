import {AiFillPlusCircle} from 'react-icons/all';
import {NoticeboardFormProps} from '../NoticeboardAdminContent';

const AddRemoveButton = (props: NoticeboardFormProps) => {
  const {label, clickFunction} = props;
  return (
    <div className={`flex p-2`}>
      <div className={`flex flex-row w-auto mr-0 cursor-pointer`} onClick={clickFunction}>
        <p className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}>
          {label}
        </p>

        <AiFillPlusCircle
          className="w-auto text-blueberry pointer-events-none "
          size={24}
        />
      </div>
    </div>
  );
};

export default AddRemoveButton;
