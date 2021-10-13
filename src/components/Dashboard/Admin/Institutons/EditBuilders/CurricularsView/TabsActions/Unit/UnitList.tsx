import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import AddButton from '@atoms/Buttons/AddButton';
import useDictionary from '@customHooks/dictionary';
import {GlobalContext} from '@contexts/GlobalContext';

import * as queries from '@graphql/queries';
import * as customQueries from '@customGraphql/customQueries';
import Loader from '@components/Atoms/Loader';
import Tooltip from '@components/Atoms/Tooltip';
import {getAsset} from 'assets';
import {DeleteActionBtn} from '@components/Atoms/Buttons/DeleteActionBtn';
import UnitListRow from './UnitListRow';


export const UnitList = ({instId}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {UnitLookupDict} = useDictionary(clientKey);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<any>([]);

  // ~ CHECK TO SEE IF UNIT CAN BE DELETED ~ //

  /****************************************************
   *   IF UNIT HAS ANY AMOUNT OF SYLLABI ATTACHED,    *
   * OR IF THIS UNIT HAS EVER HAD ANY ACTIVE LESSONS, *
   *            THEN DO NOT ALLOW A DELETE            *
   ****************************************************/

  const checkIfRemovable = (unitObj: any) => {
    if (
      unitObj.lessons?.items?.length > 0 ||
      (unitObj.lessonHistory && unitObj.lessonHistory?.length > 0) ||
      unitObj?.isUsed
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleDelete = (input: any) => {};

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //

  useEffect(() => {
    fetchSyllabusList();
  }, []);

  const fetchSyllabusList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalSyllabuss, {
          filter: {
            institutionID: {eq: instId},
          },
        })
      );
      setUnits(result.data?.listUniversalSyllabuss.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleAdd = () => {
    history.push(`${match.url}/add`);
  };
  const handleView = (unitId: string) => {
    history.push(`${match.url}/${unitId}/edit`);
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div className="pt-0 flex m-auto justify-center h-full p-8">
      <div className="flex flex-col">
        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader />
            </div>
          </div>
        ) : units.length ? (
          <>
            <div className="flex justify-between items-center w-full m-auto">
              <h3 className="text-lg leading-6 uppercase text-gray-600 w-auto">Units</h3>
              <AddButton
                label={UnitLookupDict[userLanguage]['NEW_UNIT']}
                onClick={handleAdd}
              />
            </div>
            <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <div className="flex justify-between bg-gray-50 px-8 whitespace-nowrap">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{UnitLookupDict[userLanguage]['NO']}</span>
                </div>
                <div className="w-8/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{UnitLookupDict[userLanguage]['NAME']}</span>
                </div>
                <div className="w-1/10 m-auto py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UnitLookupDict[userLanguage]['ACTION']}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 w-full m-auto flex-1 overflow-y-auto">
              {units.map((unit: any, index: number) => (
                <UnitListRow
                  key={`unit_list_row_${index}`}
                  index={index}
                  item={unit}
                  checkIfRemovable={checkIfRemovable}
                  handleDelete={handleDelete}
                  editCurrentUnit={handleView}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mt-8">
              <AddButton
                className="mx-4"
                label={UnitLookupDict[userLanguage]['NEW_UNIT']}
                onClick={handleAdd}
              />
            </div>
            <p className="text-center p-16"> {UnitLookupDict[userLanguage]['INFO']}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UnitList;
