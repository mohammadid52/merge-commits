import React, {useState} from 'react';
import {updateUniversalJournalData} from 'graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';
import {ITabViewProps} from '../TabView';
import {Switch} from 'antd';

interface IToggleProps extends ITabViewProps {
  toggled?: boolean;
  label?: string;
  addToJournalUpdateQueue?: (journalObj: any) => void;
}

const Toggle = ({
  toggled,
  label,

  currentContentObj,
  addToJournalUpdateQueue
}: IToggleProps) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const updateJournalShare = async () => {
    addToJournalUpdateQueue?.(currentContentObj);

    setUpdating(true);
    try {
      await API.graphql(
        graphqlOperation(updateUniversalJournalData, {
          input: {
            id: currentContentObj?.id,
            shared: currentContentObj?.hasOwnProperty('shared')
              ? // @ts-ignore
                !currentContentObj?.shared
              : true
          }
        })
      );
    } catch (e) {
      console.error('error updating sharing - ', e);
    } finally {
      //
    }
  };

  const handleToggler = () => {
    if (!updating) {
      setIsToggled(!isToggled);
      updateJournalShare().then((_: void) => setUpdating(false));
    }
  };

  const [isToggled, setIsToggled] = useState(Boolean(toggled));

  return (
    <div className="mt-4 mb-2 ml-2 w-auto flex items-center">
      <Switch checked={isToggled} onChange={handleToggler} />

      {/* <button
        onClick={!updating ? () => handleToggler() : () => {}}
        type="button"
        className={`${
          toggled ? "bg-green-600" : "bg-light"
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        role="switch"
        aria-checked="false"
        aria-labelledby="annual-billing-label"
      >

        <span
          aria-hidden="true"
          className={`${
            toggled ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        ></span>
      </button> */}

      {label && (
        <span className="mx-2" id="shared-label">
          <span className="text-sm font-medium text-darkest"> Shared</span>
        </span>
      )}
    </div>
  );
};

export default React.memo(Toggle);
