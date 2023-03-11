import Buttons from "atoms/Buttons";
import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import {
  AiFillPlusCircle,
  AiOutlineSave,
  AiOutlineStop,
} from "react-icons/all";
import { IconContext } from "react-icons/lib/esm/iconContext";
import { NoticeboardFormProps } from "../NoticeboardAdminContent";

const CreateNewButton = (props: NoticeboardFormProps) => {
  const { viewEditMode, handleEditToggle, widgetObj, resetNewWidgetData } =
    props;
  const { userLanguage } = useGlobalContext();
  const { anthologyDict } = useDictionary();

  const handleCancel = () => {
    resetNewWidgetData?.();
  };

  const handleCreateNew = () => {
    resetNewWidgetData?.();
    handleEditToggle?.("create", widgetObj?.widgetID);
  };

  return (
    <div
      className={`flex p-2 ${viewEditMode?.mode === "create" ? "mt-2" : ""}`}
    >
      {viewEditMode?.mode === "create" &&
      viewEditMode?.widgetID === widgetObj?.widgetID ? (
        <Buttons
          onClick={handleCancel}
          label={anthologyDict[userLanguage].ACTIONS.CANCEL}
          type={`button`}
          Icon={AiOutlineStop}
          btnClass={`mr-4`}
        />
      ) : (
        <div
          className={`flex flex-row w-auto mr-0 cursor-pointer`}
          onClick={handleCreateNew}
        >
          <p
            className={`w-auto mr-2 cursor-pointer font-semibold text-blueberry`}
          >
            {anthologyDict[userLanguage].ACTIONS.CREATE}
          </p>
          <IconContext.Provider
            value={{ className: "w-auto text-blueberry pointer-events-none " }}
          >
            <AiFillPlusCircle size={24} />
          </IconContext.Provider>
        </div>
      )}
      {viewEditMode?.mode === "create" &&
      viewEditMode?.widgetID === widgetObj?.widgetID ? (
        <>
          <Buttons
            onClick={() =>
              widgetObj?.id && handleEditToggle?.("savenew", widgetObj?.id)
            }
            label={anthologyDict[userLanguage].ACTIONS.SAVE}
            type={`button`}
            Icon={AiOutlineSave}
          />
        </>
      ) : null}
    </div>
  );
};

export default CreateNewButton;
