import Buttons from '@components/Atoms/Buttons';
import Loader from '@components/Atoms/Loader';
import PageWrapper from '@components/Atoms/PageWrapper';
import {useGlobalContext} from '@contexts/GlobalContext';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {ListUploadLogsQueryVariables, UploadLogs} from 'API';
import {orderBy} from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {BiCloudDownload} from 'react-icons/bi';
import {HiChevronDown} from 'react-icons/hi';
import {Redirect} from 'react-router';

const UploadLogsPage = () => {
  const {checkIfAdmin} = useGlobalContext();
  if (!checkIfAdmin()) {
    return <Redirect to={'/dashboard/home'} />;
  }

  const {data, setData, isLoading, isFetched} = useGraphqlQuery<
    ListUploadLogsQueryVariables,
    UploadLogs[]
  >(
    'listUploadLogs',
    {limit: 150},
    {
      custom: true,
      enabled: checkIfAdmin(),
      onSuccess: (data) => {
        const orderedList = orderBy([...data], ['createdAt'], ['desc']);
        setData([...orderedList]);
      }
    }
  );

  const [currentOrder, setCurrentOrder] = useState<boolean | 'asc' | 'desc'>('asc');

  const reorder = () => {
    setCurrentOrder(currentOrder === 'asc' ? 'desc' : 'asc');

    const orderedList = orderBy([...data], ['createdAt'], [currentOrder]);
    setData([...orderedList]);
  };

  const commonClass =
    ' text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider';

  return (
    <div className="p-4 pt-8">
      <PageWrapper>
        <table className="border-collapse table-auto w-full table-hover table-striped">
          <thead className="thead-light bg-gray-50">
            <tr className="p-4 flex items-center justify-between">
              <th
                onClick={reorder}
                scope="col"
                className={`w-1/10 cursor-pointer hover:theme-text ${commonClass}`}>
                <span className="flex items-center">
                  Upload date{' '}
                  <HiChevronDown
                    style={{
                      transform: currentOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0)'
                    }}
                    className="text-gray-800 w-auto ml-2"
                  />
                </span>
              </th>

              <th scope="col" className={`w-1/10 ${commonClass}`}>
                Uploaded by
              </th>

              <th scope="col" className={`w-2/10 ${commonClass}`}>
                Classroom
              </th>

              <th scope="col" className={`w-1/10 ${commonClass}`}>
                Unit
              </th>

              <th scope="col" className={`w-1/10 ${commonClass}`}>
                Survey
              </th>
              <th scope="col" className={`w-1.5/10 ${commonClass}`}>
                Survey Link
              </th>
              <th scope="col" className={`w-1/10 ${commonClass}`}>
                Reason type
              </th>
              <th scope="col" className={`w-1/10 ${commonClass}`}>
                Reason
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !isFetched && (
              <div className="h-32 flex items-center justify-center">
                <Loader animation />
              </div>
            )}
            {!isLoading &&
              isFetched &&
              data.map((uploadLog) => {
                return (
                  <tr className="flex items-center justify-between p-4">
                    <td className="w-1/10">{moment(uploadLog.Date).format('ll')}</td>
                    <td className="w-1/10">
                      {uploadLog.person.firstName} {uploadLog.person.lastName}
                    </td>
                    <td className="w-2/10">{uploadLog.room.name}</td>
                    <td className="w-1/10">{uploadLog.unit.name}</td>
                    <td className="w-1/10">{uploadLog.lesson.title}</td>
                    <td className="w-1.5/10">
                      <a href={uploadLog.urlLink} target="_blank">
                        <Buttons
                          size="small"
                          Icon={BiCloudDownload}
                          transparent
                          title="Download Csv"
                          label={'Download Csv'}
                          disabled={!uploadLog.urlLink}
                        />
                      </a>
                    </td>
                    <td className="w-1/10">{uploadLog.UploadType}</td>
                    <td className="w-1/10">{uploadLog.Reason}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </PageWrapper>
    </div>
  );
};

export default UploadLogsPage;
