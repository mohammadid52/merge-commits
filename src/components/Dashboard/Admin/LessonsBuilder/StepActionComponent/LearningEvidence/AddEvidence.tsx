import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";

import Buttons from "atoms/Buttons";
import Selector from "atoms/Form/Selector";
import TextArea from "atoms/Form/TextArea";

const AddEvidence = () => {
  const { userLanguage } = useGlobalContext();
  const { LessonBuilderDict } = useDictionary();

  const AddEvidenceDict =
    LessonBuilderDict[userLanguage]["LEARNING_EVIDENCE_COLUMNS"][
      "ADD_EVIDENCE"
    ];
  return (
    <div className="p-4">
      <div className="">
        <div className="mb-4">
          <TextArea
            rows={3}
            id="criteria"
            value={""}
            // onChange={onInputChange}
            name="criteria"
            label={AddEvidenceDict["OBJECTIVE"]}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="mb-4">
            <Selector
              selectedItem={""}
              list={[]}
              placeholder={AddEvidenceDict["TOPICS"]}
              onChange={() => console.log("on selector change")}
            />
          </div>
          <div className="mb-4">
            <Selector
              selectedItem={""}
              list={[]}
              placeholder={AddEvidenceDict["MEASUREMENTS"]}
              onChange={() => console.log("on selector change")}
            />
          </div>
        </div>
        <div className="mb-4">
          <Selector
            selectedItem={""}
            list={[]}
            placeholder={AddEvidenceDict["ACTIVITY"]}
            onChange={() => console.log("on selector change")}
          />
        </div>
        <div className="ml-4 w-auto">
          <Buttons
            btnClass="ml-4 py-1"
            label="Add"
            onClick={() => console.log("add")}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEvidence;
