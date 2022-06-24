import React, {useEffect, useState, useContext, useRef} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from '../../../graphql/mutations';
import * as customQueries from '../../../customGraphql/customQueries';
import * as queries from '@graphql/queries';
import Selector from '../../Atoms/Form/Selector';
import DateAndTime from '../DateAndTime/DateAndTime';
import {getAsset} from '../../../assets';
import useDictionary from '../../../customHooks/dictionary';
import {v4 as uuidv4} from 'uuid';
import {Storage} from 'aws-amplify';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaSpinner} from 'react-icons/fa';

interface ICsvProps {
  institutionId?: string;
}

const UploadCsv = ({institutionId}: ICsvProps) => {
  const {state, theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [file, setFile] = useState<any>(null);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<{
    id: number;
    name: string;
    value: string;
  }>({
    id: 0,
    name: '',
    value: '',
  });
  const [imgUrl, setImgUrl] = useState<string[] | Object[]>([]);

  const fileReader = new FileReader();
  const fileInputRef = useRef<HTMLInputElement>();

  const reasonDropdown = [
    {
      id: 1,
      name: 'Paper Survey',
      value: 'paper-survey',
    },
    {
      id: 2,
      name: 'User Update Survey',
      value: 'user-update',
    },
  ];

  const isSuperAdmin = state.user.role === 'SUP';

  const _UploadToS3 = async (
    imageFile: File,
    imageFileName: string,
    imageFileType: string
  ) => {
    try {
      const FileUpload = await Storage.put(imageFileName, imageFile, {
        contentType: imageFileType,
        contentEncoding: 'base64',
        completeCallback: (event: any) => {
          console.log(`Successfully uploaded ${event.key}`);
        },
        progressCallback: (progress: any) => {
          console.log(`Uploaded: ${progress.loaded * 100}/${progress.total}`);
        },
        errorCallback: (err: any) => {
          console.error('Unexpected error while uploading', err);
        },
      });

      return FileUpload;
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 81 ~ UploadCsv ~ error', error);
    }
  };

  const _GetUrlFromS3 = async (key: string) => {
    try {
      const getFileURL = await Storage.get(key, {
        level: 'public',
      });
      return getFileURL;
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 92 ~ const_GetUrlFromS3= ~ error',
        error
      );
    }
  };

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
      return JSON.stringify(obj);
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
        UploadType: selectedReason.value,
        ...(imgUrl && {PaperSurveyURL: imgUrl}),
        Reason: reason,
      };

      const newUploadLogs: any = await API.graphql(
        graphqlOperation(mutations.createUploadLogs, {
          input: value,
        })
      );

      const returnedData = newUploadLogs.data.createUploadLogs;
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
            setSelectedReason({
              id: 0,
              name: '',
              value: '',
            });
            setImgUrl([]);
            setFile(null);
            setReason('');
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          }
        };

        fileReader.readAsText(file);
      }
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 38 ~ handleSubmit ~ error', error);
    }
  };

  const onReasonSelected = (id: any, name: string, value: string) => {
    let reasonDropdownValue = {id, name, value};
    setSelectedReason(reasonDropdownValue);
  };

  const imageUpload = async (e: any) => {
    setLoading(true);
    try {
      e.preventDefault();
      let imgArr = fileInputRef.current.files;
      for (let i = 0; i < imgArr.length; i++) {
        const file = imgArr[i];
        const fileName = file.name;
        const fileType = file.type;
        const fileUpload: any = await _UploadToS3(file, fileName, fileType);
        const fileUrl = await _GetUrlFromS3(fileUpload.key);
        setImgUrl((prevState: any) => [...prevState, fileUrl]);
      }
      setLoading(false);
    } catch (e) {
      console.log('error uploading image', e);
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
      <Selector
        btnClass={!file && 'cursor-not-allowed'}
        disabled={!file}
        loading={loading}
        selectedItem={selectedReason ? selectedReason.name : ''}
        placeholder="Select Reason"
        list={reasonDropdown}
        onChange={(value, name, id) => onReasonSelected(id, name, value)}
      />
      <br />
      {selectedReason.value === 'paper-survey' && (
        <>
          <label htmlFor="imgFile">Upload Multipe Survey Images</label>
          <input
            id="imgFile"
            multiple
            className="mt-2"
            type="file"
            disabled={!file}
            accept="image/*"
            ref={fileInputRef}
            onChange={imageUpload}
          />
          {loading && (
            <IconContext.Provider
              value={{
                size: '1.2rem',
                style: {
                  left: '-25%',
                  top: '-5%',
                },
                className: `relative mr-4 animate-spin ${theme.textColor[themeColor]}`,
              }}>
              <FaSpinner />
            </IconContext.Provider>
          )}
        </>
      )}
      <br />
      <textarea
        className={`w-full h-32 border-2 border-gray-300 rounded-lg ${
          (!file || loading || !selectedReason.value) && `cursor-not-allowed`
        }`}
        placeholder={'Reason'}
        rows={10}
        cols={50}
        value={reason}
        disabled={!file || loading || !selectedReason.value}
        onChange={(e: any) => setReason(e.target.value)}
      />
      {success && (
        <div className="flex flex-row mt-2 justify-center">
          <h2>Successfully Uploaded!</h2>
        </div>
      )}
      <div className="grid grid-cols-4 gap-x-4 mt-3">
        <button
          type="button"
          className={`col-end-5 ${
            isSuperAdmin ? 'mt-5' : ''
          } inline-flex justify-center h-9 border-0 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center ${
            !reason && `cursor-not-allowed`
          }`}
          style={{
            /* stylelint-disable */
            opacity: reason ? 1 : 0.5,
          }}
          disabled={!reason || loading || !selectedReason.value}
          onClick={(e) => handleSubmit(e)}>
          Upload CSV
          {/* )} */}
        </button>
      </div>
    </div>
  );
};

export default React.memo(UploadCsv);
