import React, {useState} from 'react';
import {ContentCardProps} from '../AnthologyContent';
import * as mutations from '../../../../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';

interface IToggleProps extends ContentCardProps {
  toggled?: boolean;
  label?: string;
  addToJournalUpdateQueue?: (journalObj: any) => void;
}

const Toggle = ({
  toggled,
  label,
  allUniversalJournalData,
  currentContentObj,
  addToJournalUpdateQueue,
}: IToggleProps) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const updateJournalShare = async () => {
    addToJournalUpdateQueue(currentContentObj);

    setUpdating(true);
    try {
      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {
          input: {
            id: currentContentObj.id,
            shared: currentContentObj.hasOwnProperty('shared')
              ? !currentContentObj?.shared
              : true,
          },
        })
      );
    } catch (e) {
      console.error('error updating sharing - ', e);
    } finally {
      //
    }
  };

  const handleToggler = () => {
    updateJournalShare().then((_: void) => setUpdating(false));
  };

  return (
    <div className="mt-4 mb-2 ml-2 w-auto flex items-center">
      {/* <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" --> */}
      <button
        onClick={!updating ? () => handleToggler() : () => {}}
        type="button"
        className={`${
          toggled ? 'bg-green-600' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        role="switch"
        aria-checked="false"
        aria-labelledby="annual-billing-label">
        {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
        <span
          aria-hidden="true"
          className={`${
            toggled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
      </button>

      {label && (
        <span className="mx-2" id="shared-label">
          <span className="text-sm font-medium text-gray-900"> Shared</span>
        </span>
      )}
    </div>
  );
};

export default React.memo(Toggle);
