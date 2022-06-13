import React, {useEffect, useState, useContext} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from '../../../graphql/mutations';
import * as customQueries from '../../../customGraphql/customQueries';
import * as queries from '@graphql/queries';
import Selector from '../../Atoms/Form/Selector';
import {createFilterToFetchSpecificItemsOnly} from '../../../utilities/strings';
import {CSVLink} from 'react-csv';
import DateAndTime from '../DateAndTime/DateAndTime';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import useDictionary from '../../../customHooks/dictionary';
import {orderBy, uniqBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';

interface ICsvProps {
  institutionId?: string;
}

const UploadCsv = ({institutionId}: ICsvProps) => {
  const {state, theme, dispatch, clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict} = useDictionary(clientKey);

  const [file, setFile] = useState<any>(null);
  const [reason, setReason] = useState<string>('');

  const fileReader = new FileReader();

  const isSuperAdmin = state.user.role === 'SUP';

  const handleUpload = async (e: any) => {
    try {
      setFile(e.target.files[0]);
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 39 ~ handleUpload ~ error', error);
    }
  };

  const csvFileToArray = (string: any) => {
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const array = csvRows.map((i: any) => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object: any, header: any, index: any) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    return array;
  };
  const createSurveyData = async (data: any[]) => {
    try {
      const value = {
        id: uuidv4(),
        updatedUserId: state.user.authId,
        surveyData: data,
      };

      const newSurveyData: any = await API.graphql(
        graphqlOperation(mutations.createTemporaryUniversalUploadSurveyData, {
          input: value,
        })
      );

      const returnedData = newSurveyData.data.createTemporaryUniversalUploadSurveyData;
      console.log('createSurveyData', returnedData);

      return returnedData;
    } catch (e) {
      console.error('error creating survey data - ', e);
      return {};
    }
  };

  const createUploadLogs = async () => {
    try {
      const value = {
        id: uuidv4(),
        User_id: state.user.authId,
        Date: new Date().toISOString().split('T')[0],
        Reason: reason,
      };

      const newUploadLogs: any = await API.graphql(
        graphqlOperation(mutations.createUploadLogs, {
          input: value,
        })
      );

      const returnedData = newUploadLogs.data.createTemporaryUniversalUploadLogs;
      console.log('createUploadLogs', returnedData);

      return returnedData;
    } catch (e) {
      console.error('error creating upload logs - ', e);
      return {};
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (file) {
        fileReader.onload = async (event: any) => {
          const result = csvFileToArray(event.target.result);
          if (result.length > 0) {
            await createSurveyData(result);
            await createUploadLogs();
          }
        };

        fileReader.readAsText(file);
      }
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 38 ~ handleSubmit ~ error', error);
    }
  };

  return (
    <div className="flex flex-col overflow-h-scroll w-full h-full px-8 py-4">
      <div className="mx-auto w-full">
        <div className="flex flex-row my-0 w-full py-0 mb-8 justify-between">
          <h3 className="text-lg leading-6 text-gray-600 w-auto">
            {CsvDict[userLanguage]['TITLE']}
          </h3>
          {/* <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
            <span>{CsvDict[userLanguage]['TITLE']}</span>
          </div> */}
          <div className="w-auto">
            <span className={`mr-0 float-right text-gray-600 text-right`}>
              <DateAndTime />
            </span>
          </div>
        </div>
      </div>
      <input id="csvFile" type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} />
      <br />
      <textarea
        className="w-full h-32 border-2 border-gray-300 rounded-lg"
        placeholder={'Reason'}
        rows={10}
        cols={50}
        value={reason}
        disabled={file === null}
        onChange={(e: any) => setReason(e.target.value)}
      />

      <div className="grid grid-cols-4 gap-x-4">
        <button
          type="button"
          className={`col-end-5 ${
            isSuperAdmin ? 'mt-5' : ''
          } inline-flex justify-center h-9 border-0 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center`}
          style={{
            /* stylelint-disable */
            opacity: reason ? 1 : 0.5,
          }}
          disabled={!reason}
          onClick={(e) => handleSubmit(e)}>
          Upload CSV
          {/* )} */}
        </button>
      </div>
    </div>
  );
};

export default React.memo(UploadCsv);
