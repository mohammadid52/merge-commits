import React, {Fragment, useContext, useEffect} from 'react';
import {useHistory} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as queries from '@graphql/queries';

import PageWrapper from '../../../../Atoms/PageWrapper';
import Buttons from '../../../../Atoms/Buttons';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import Tooltip from '../../../../Atoms/Tooltip';
import AddButton from '../../../../Atoms/Buttons/AddButton';
import {createFilterToFetchSpecificItemsOnly} from '@utilities/strings';

interface CurriculumListProps {
  curricular: {items: {name?: string; id: string}[]};
  instId: string;
  instName: string;
}

const CurriculumList = ({curricular, instId, instName}: CurriculumListProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const theme = gContext.theme;
  const userLanguage = gContext.userLanguage;

  const {InstitueCurriculam, BreadcrumsTitles} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const history = useHistory();

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //
  // const getUnusedCurriculums = async (curriculumArr: any[]) => {
  //   const allCurriculums = curriculumArr.reduce((acc: string[], curriculum: any) => {
  //     return [...acc, curriculum.id];
  //   }, []);
  //   if (allCurriculums.length > 0) {
  //     try {
  //       const allCurriculumsFilter = createFilterToFetchSpecificItemsOnly(
  //         allCurriculums,
  //         'curriculumID'
  //       );

  //       const allRoomCurriculums: any = await API.graphql(
  //         graphqlOperation(queries.listRoomCurriculums, {
  //           filter: {...allCurriculumsFilter},
  //         })
  //       );

  //       const responseItems = allRoomCurriculums?.data?.listRoomCurriculums?.items;

  //       const unusedCurriculums = allCurriculums.reduce(
  //         (unusedAcc: string[], curriculumID: string) => {
  //           if (
  //             unusedAcc.indexOf(curriculumID) === -1 &&
  //             allCurriculums.indexOf(curriculumID) > -1
  //           ) {
  //             return unusedAcc;
  //           } else {
  //             return [...unusedAcc, curriculumID];
  //           }
  //         },
  //         []
  //       );

  //       console.log('unused curriculums - ', unusedCurriculums);
  //     } catch (e) {
  //       console.error('getUnusedCurriculums() - ', e);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (curricular) {
  //     getUnusedCurriculums(curricular.items);
  //   }
  // }, [curricular]);

  const createNewCurricular = () => {
    history.push(
      `/dashboard/manage-institutions/institution/curricular-creation?id=${instId}`
    );
  };

  const editCurrentCurricular = (id: string) => {
    history.push(`/dashboard/manage-institutions/${instId}/curricular?id=${id}`);
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div className="pt-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {instName ? instName.toUpperCase() : 'INSTITUTE'} CURRICULA
          </h3>
          {curricular.items && curricular.items.length > 0 ? (
            <Fragment>
              <div className="flex justify-end w-full m-auto ">
                <AddButton
                  className="mx-4"
                  label={InstitueCurriculam[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewCurricular}
                />
              </div>
              <div className="flex justify-between w-full m-auto px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculam[userLanguage]['NO']}</span>
                </div>
                <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculam[userLanguage]['NAME']}</span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculam[userLanguage]['ACTION']}</span>
                </div>
              </div>

              <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
                {curricular.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                      {index + 1}.
                    </div>
                    <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {item.name ? item.name : ''}
                    </div>
                    <span
                      className={`w-3/10 h-6 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]}`}
                      onClick={() => editCurrentCurricular(item.id)}>
                      <Tooltip text="View curriculam details" placement="left">
                        {InstitueCurriculam[userLanguage]['VIEW']}
                      </Tooltip>
                    </span>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="flex justify-center mt-8">
                <Buttons
                  btnClass="mx-4"
                  label={InstitueCurriculam[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewCurricular}
                />
              </div>
              <p className="text-center p-16">
                {' '}
                {InstitueCurriculam[userLanguage]['INFO']}
              </p>
            </Fragment>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default CurriculumList;
