import React, {memo} from 'react';
import {ContentCardProps} from '../AnthologyContent';
import * as mutations from '../../../../graphql/mutations';
import API, {graphqlOperation} from '@aws-amplify/api';

interface IToggleProps extends ContentCardProps {
  toggled?: boolean;
  label?: string;
}

const Toggle = ({
  toggled,
  label,
  allUniversalJournalData,
  currentContentObj,
  setAllUniversalJournalData,
}: IToggleProps) => {
  const updateJournalShare = async () => {
    const mergedJournalData = allUniversalJournalData.map((dataRecord: any) => {
      if (dataRecord.id === currentContentObj.id) {
        return {...dataRecord, shared: !dataRecord.shared};
      } else {
        return dataRecord;
      }
    });

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
      setAllUniversalJournalData(mergedJournalData);
    } catch (e) {
      console.error('error updating journal feedbacks - ', e);
    } finally {
      //
    }
  };

  return (
    <div className="w-auto flex items-center">
      {/* <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" --> */}
      <button
        type="button"
        className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        role="switch"
        aria-checked="false"
        aria-labelledby="annual-billing-label">
        {/* <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" --> */}
        <span
          aria-hidden="true"
          className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
      </button>

      {label && (
        <span className="mr-3" id="annual-billing-label">
          <span className="text-sm font-medium text-gray-900">Annual billing </span>
        </span>
      )}
    </div>
  );
};

export default React.memo(Toggle);
