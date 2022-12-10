import Buttons from '@components/Atoms/Buttons';
import Label from '@components/Atoms/Form/Label';
import DotMenu from '@components/TeacherView/ClassRoster/RosterRow/DotMenu';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {logError} from '@graphql/functions';
import {
  ErrorLog,
  ErrorStatus,
  ListErrorLogsQueryVariables,
  UpdateErrorLogInput
} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import * as customMutations from 'customGraphql/customMutations';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router';
import UserListLoader from '../Admin/UserManagement/UserListLoader';

const ErrorItem = ({
  error,
  updateStatus,
  idx
}: {
  updateStatus: (id: string, status: ErrorStatus, idx: number, item: ErrorLog) => void;
  error: ErrorLog;
  idx: number;
}) => {
  const pendingItem = {
    label: 'set to pending',
    action: () => {
      updateStatus(error.id, ErrorStatus.PENDING, idx, error);
    }
  };

  const reviewItem = {
    label: 'set to review',
    action: () => {
      updateStatus(error.id, ErrorStatus.REVIEW, idx, error);
    }
  };

  const errorStatus = error.status;

  const closedItem = {
    label: 'set to closed',
    action: () => {
      updateStatus(error.id, ErrorStatus.CLOSED, idx, error);
    }
  };

  const menuItems =
    errorStatus === ErrorStatus.PENDING
      ? [reviewItem, closedItem]
      : errorStatus === ErrorStatus.REVIEW
      ? [pendingItem, closedItem]
      : [pendingItem, reviewItem];

  const statusBorder = () => {
    switch (errorStatus) {
      case ErrorStatus.PENDING:
        return 'border-indigo-500';
      case ErrorStatus.REVIEW:
        return 'border-blue-500';
      case ErrorStatus.CLOSED:
        return 'border-green-500';

      default:
        return 'border-indigo-500';
    }
  };

  return (
    <tr className={`bg-gray-100 border-l-4 ${statusBorder()}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {error.email}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {error.errorType.slice(0, 20)}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {moment(error.errorTime).format('lll')}
      </td>
      <td className="text-sm theme-text:600 hover:theme-text:500 text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        <a href={error.pageUrl}>{error.pageUrl}</a>
      </td>
      <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        <div className={`dot-menu transition duration-150`}>
          <DotMenu menuItems={[...menuItems]} />
        </div>
      </td>
    </tr>
  );
};

const ErrorsPage = () => {
  const {authId, email} = useAuth();
  const {checkIfAdmin} = useGlobalContext();
  if (!checkIfAdmin()) {
    return <Redirect to={'/dashboard/home'} />;
  }

  const {data, setData, isLoading, isFetched} = useGraphqlQuery<
    ListErrorLogsQueryVariables,
    ErrorLog[]
  >('listErrorLogs', {limit: 100}, {enabled: checkIfAdmin()});

  const [filteredList, setFilteredList] = useState([...data]);

  useEffect(() => {
    if (!isLoading && isFetched) {
      setFilteredList([...data]);
    }
  }, [isLoading, isFetched]);

  const updateStatus = async (
    id: string,
    status: ErrorStatus,
    idx: number,
    item: ErrorLog
  ) => {
    try {
      const updatedError = {...item, status};

      data.splice(idx, 0, updatedError);
      setData([...data]);
      setFilteredList([...data]);

      const input: UpdateErrorLogInput = {
        id,
        status
      };
      const res = await API.graphql(
        graphqlOperation(customMutations.updateErrorLog, {input})
      );
    } catch (error) {
      logError(error, {email, authId}, '@updateStatus');
    }
  };

  const [filters, setFilters] = useState<ErrorStatus[]>([]);

  const updateFilter = (filterName: ErrorStatus) => {
    if (filters.includes(filterName)) {
      setFilters(filters.filter((_d) => _d !== filterName));
      if (filters.length === 0) {
        setFilteredList([...data]);
      } else {
        const filtered = data.filter((_d: ErrorLog) => filters.includes(_d.status));
        setFilteredList([...filtered]);
      }
    } else {
      filters.push(filterName);
      const filtered = data.filter((_d: ErrorLog) => filters.includes(_d.status));
      setFilteredList([...filtered]);
      setFilters([...filters]);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 my-8 inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <Label label="Filters" />
            <div className="flex gap-x-4 mb-4 mt-2 items-center">
              <Buttons
                onClick={() => updateFilter(ErrorStatus.PENDING)}
                transparent={!filters.includes(ErrorStatus.PENDING)}
                label={'Pending'}
              />
              <Buttons
                onClick={() => updateFilter(ErrorStatus.CLOSED)}
                transparent={!filters.includes(ErrorStatus.CLOSED)}
                label={'Closed'}
              />
              <Buttons
                onClick={() => updateFilter(ErrorStatus.REVIEW)}
                transparent={!filters.includes(ErrorStatus.REVIEW)}
                label={'Review'}
              />
            </div>
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b-0">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    email
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    error
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    time
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    url
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <UserListLoader userRole="ADM" />
                ) : filteredList.length > 0 ? (
                  filteredList.map((error, idx) => (
                    <ErrorItem
                      idx={idx}
                      updateStatus={updateStatus}
                      error={error}
                      key={idx}
                    />
                  ))
                ) : (
                  <p className="min-h-56 flex items-center w-full justify-center text-gray-500">
                    {filters.length > 0
                      ? `No errors found for status - ${filters.join(', ')}`
                      : 'Woahhh.. no errors.. its good.'}
                  </p>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorsPage;
