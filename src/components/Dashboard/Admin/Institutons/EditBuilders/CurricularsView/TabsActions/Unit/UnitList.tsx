import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import AddButton from '@atoms/Buttons/AddButton';
import useDictionary from '@customHooks/dictionary';
import {GlobalContext} from '@contexts/GlobalContext';

import * as queries from '@graphql/queries';
import Loader from '@components/Atoms/Loader';
import Tooltip from '@components/Atoms/Tooltip';
import {getAsset} from 'assets';

export const UnitList = ({instId}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {UnitLookupDict} = useDictionary(clientKey);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<any>([]);

  useEffect(() => {
    fetchSyllabusList();
  }, []);

  const fetchSyllabusList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.listUniversalSyllabuss)
      );
      console.log(result, 'resulttttttttttt');
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

  return (
    <div className="pt-0 flex m-auto justify-center p-8">
      <div className="">
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
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UnitLookupDict[userLanguage]['ACTION']}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
              {units.map((unit: any, index: number) => (
                <div
                  key={index}
                  className={`flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 ${
                    index % 2 !== 0 ? 'bg-gray-50' : ''
                  }`}>
                  <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                    {index + 1}.
                  </div>
                  <div className="flex w-8/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                    {unit.name || ''}
                  </div>
                  <span
                    className={`w-1/10 h-6 text-left flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]}`}
                    onClick={() => handleView(unit.id)}>
                    <Tooltip
                      text={UnitLookupDict[userLanguage]['UNIT_DETAILS']}
                      placement="left">
                      {UnitLookupDict[userLanguage]['VIEW']}
                    </Tooltip>
                  </span>
                </div>
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
