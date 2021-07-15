import React, { useContext } from 'react';

import useDictionary from '../../../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';

import Selector from '../../../../../Atoms/Form/Selector';
import TextArea from '../../../../../Atoms/Form/TextArea';
import Buttons from '../../../../../Atoms/Buttons';

const AddEvidence = () => {
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  const AddEvidenceDict =
    LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['ADD_EVIDENCE'];
  return (
    <div className="p-4">
      <div className="">
        <div className="mb-4">
          <TextArea
            rows={3}
            id="criteria"
            value={''}
            // onChange={onInputChange}
            name="criteria"
            label={AddEvidenceDict['OBJECTIVE']}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="mb-4">
            <Selector
              selectedItem={''}
              list={[]}
              placeholder={AddEvidenceDict['TOPICS']}
              onChange={() => console.log('on selector change')}
            />
          </div>
          <div className="mb-4">
            <Selector
              selectedItem={''}
              list={[]}
              placeholder={AddEvidenceDict['MEASUREMENTS']}
              onChange={() => console.log('on selector change')}
            />
          </div>
        </div>
        <div className="mb-4">
          <Selector
            selectedItem={''}
            list={[]}
            placeholder={AddEvidenceDict['ACTIVITY']}
            onChange={() => console.log('on selector change')}
          />
        </div>
        <div className="ml-4 w-auto">
          <Buttons
            btnClass="ml-4 py-1"
            label="Add"
            onClick={() => console.log('add')}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEvidence;