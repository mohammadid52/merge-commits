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
import React, {useState} from 'react';
import {Redirect} from 'react-router';
import UserListLoader from '../Admin/UserManagement/UserListLoader';

const ErrorItem = ({
  error,
  updateStatus
}: {
  updateStatus: (id: string, status: ErrorStatus) => void;
  error: ErrorLog;
}) => {
  const [errorStatus, setErrorStatus] = useState(error.status || ErrorStatus.PENDING);

  const pendingItem = {
    label: 'set to pending',
    action: () => {
      setErrorStatus(ErrorStatus.PENDING);
      updateStatus(error.id, ErrorStatus.PENDING);
    }
  };

  const reviewItem = {
    label: 'set to review',
    action: () => {
      setErrorStatus(ErrorStatus.REVIEW);
      updateStatus(error.id, ErrorStatus.REVIEW);
    }
  };

  const closedItem = {
    label: 'set to closed',
    action: () => {
      setErrorStatus(ErrorStatus.CLOSED);
      updateStatus(error.id, ErrorStatus.CLOSED);
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

  const {data, isLoading} = useGraphqlQuery<ListErrorLogsQueryVariables, ErrorLog[]>(
    'listErrorLogs',
    {limit: 100},
    {enabled: checkIfAdmin()}
  );

  const updateStatus = async (id: string, status: ErrorStatus) => {
    try {
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

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="py-2 my-8 inline-block min-w-full sm:px-6 lg:px-8">
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
                ) : (
                  data.length > 0 &&
                  data.map((error, idx) => (
                    <ErrorItem updateStatus={updateStatus} error={error} key={idx} />
                  ))
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
