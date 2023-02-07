import Buttons from '@components/Atoms/Buttons';
import Label from '@components/Atoms/Form/Label';
import Loader from '@components/Atoms/Loader';
import ModalPopUp from '@components/Molecules/ModalPopUp';
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
import * as queries from 'graphql/queries';
import * as mutations from 'graphql/mutations';
import * as customMutations from 'customGraphql/customMutations';
import {orderBy, update} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {Redirect} from 'react-router';

const ErrorItem = ({
  error,
  updateStatus,
  idx,
  setShowModal
}: {
  setShowModal: React.Dispatch<
    React.SetStateAction<{show: boolean; additional?: string; message: string}>
  >;
  updateStatus: (id: string, status: ErrorStatus) => void;
  error: ErrorLog;
  idx: number;
}) => {
  const pendingItem = {
    label: 'set to pending',
    action: () => {
      updateStatus(error.id, ErrorStatus.PENDING);
    }
  };

  const reviewItem = {
    label: 'set to review',
    action: () => {
      updateStatus(error.id, ErrorStatus.REVIEW);
    }
  };

  const outputError = error.error !== '' && error.error !== '{}' ? error.error : '';

  const stackItem = {
    label: 'see stack details',
    action: () => {
      setShowModal({show: true, message: outputError, additional: error.errorType});
    }
  };

  const errorStatus = error.status;

  const closedItem = {
    label: 'set to closed',
    action: () => {
      updateStatus(error.id, ErrorStatus.CLOSED);
    }
  };

  const menuItems =
    errorStatus === ErrorStatus.PENDING
      ? [reviewItem, closedItem, stackItem]
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
    <div className={`white_back p-4 pb-8 relative border-l-6 ${statusBorder()}`}>
      <div className="absolute top-0 w-auto p-4 right-0">
        <DotMenu menuItems={[...menuItems]} />
      </div>
      <h2 className=" text-sm font-medium text-gray-900">{error.email}</h2>
      <h4 className="text-sm text-red-600 font-light h-24 overflow-auto py-2">
        {outputError}
      </h4>

      <h6 className="text-sm text-gray-900 font-light overflow-auto py-2 mb-4">
        {error.componentName}
      </h6>

      <div className="absolute left-0  bottom-0 border-t-0 pt-1 border-gray-200 flex items-center justify-between px-4 py-2">
        <div
          title={error.pageUrl}
          className="text-sm underline theme-text:600 w-auto hover:theme-text:500 text-gray-900 font-light ">
          <a href={error.pageUrl}>visit url</a>
        </div>
        {errorStatus === ErrorStatus.PENDING && (
          <Buttons
            onClick={() => updateStatus(error.id, ErrorStatus.CLOSED)}
            size="small"
            transparent
            Icon={AiOutlineCloseCircle}
          />
        )}
        <p className="text-xs text-gray-500 font-light italic w-auto">
          {moment(error.errorTime).format('lll')}
        </p>
      </div>
    </div>
  );
};

const deleteClosedErrors = async () => {
  try {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    const res: any = await API.graphql(
      graphqlOperation(queries.listErrorLogs, {
        limit: 500,

        filter: {
          errorTime: {lt: date.toISOString()},
          status: {eq: ErrorStatus.CLOSED}
        }
      })
    );
    const items = res.data.listErrorLogs.items || [];

    if (items && items.length > 0) {
      for (const x of items) {
        await API.graphql(
          graphqlOperation(mutations.deleteErrorLog, {input: {id: x.id}})
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const ErrorsPage = () => {
  const {authId, email} = useAuth();
  const {checkIfAdmin} = useGlobalContext();

  if (!checkIfAdmin()) {
    return <Redirect to={'/dashboard/home'} />;
  }

  let date = new Date();
  date.setMonth(date.getMonth() - 1);

  const {data, setData, isLoading, isFetched} = useGraphqlQuery<
    ListErrorLogsQueryVariables,
    ErrorLog[]
  >(
    'listErrorLogs',
    {
      limit: 200,
      filter: {
        errorTime: {
          gt: date.toISOString()
        }
      }
    },
    {
      loopOnNextToken: true,
      enabled: checkIfAdmin(),
      onSuccess: (data) => {
        const orderedList = orderBy([...data], ['errorTime'], ['desc']);
        setData([...orderedList]);
        deleteClosedErrors();
      }
    }
  );

  const [showModal, setShowModal] = useState({show: false, message: '', additional: ''});

  const [filteredList, setFilteredList] = useState([...data]);

  useEffect(() => {
    if (!isLoading && isFetched) {
      setFilteredList([...data]);
    }
  }, [isLoading, isFetched]);

  const updateStatus = async (id: string, status: ErrorStatus) => {
    try {
      setFilters(null);

      const _idx = data.findIndex((_d: ErrorLog) => _d.id === id);
      update(data[_idx], 'status', () => status);

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

  const [filters, setFilters] = useState<ErrorStatus>();

  const updateFilter = (filterName: ErrorStatus) => {
    if (filterName === filters) {
      setFilters(null);
      setFilteredList([...data]);
    } else {
      const filtered = data.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
    }
  };

  const pendingLength = data.filter((_d: ErrorLog) => _d.status === ErrorStatus.PENDING)
    .length;

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 my-8 inline-block min-w-full sm:px-6 lg:px-8">
            <div>
              <Label label="Filters" />
              <div className="flex gap-x-4 mb-4 mt-2 items-center">
                <Buttons
                  onClick={() => updateFilter(ErrorStatus.PENDING)}
                  transparent={filters !== ErrorStatus.PENDING}
                  label={'Pending'}
                />
                <Buttons
                  onClick={() => updateFilter(ErrorStatus.CLOSED)}
                  transparent={filters !== ErrorStatus.CLOSED}
                  label={'Closed'}
                />
                <Buttons
                  onClick={() => updateFilter(ErrorStatus.REVIEW)}
                  transparent={filters !== ErrorStatus.REVIEW}
                  label={'Review'}
                />
              </div>
            </div>

            <div className="overflow-hidden">
              {isLoading ? null : (
                <h5 className="text-base mb-4 text-gray-800">
                  {pendingLength} pending errors - total {data.length} errors
                </h5>
              )}

              {isLoading ? (
                <Loader withText="loading error logs" animation />
              ) : filteredList.length > 0 ? (
                <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {filteredList.map((error, idx) => (
                    <ErrorItem
                      idx={idx}
                      setShowModal={setShowModal}
                      updateStatus={updateStatus}
                      error={error}
                      key={idx}
                    />
                  ))}
                </div>
              ) : (
                <p className="min-h-56 flex items-center w-full justify-center text-gray-500">
                  {filters !== undefined
                    ? `No errors found for status - ${filters}`
                    : 'Woahhh.. no errors.. its good.'}
                </p>
              )}
              {/* </tbody> */}
              {/* </table> */}
            </div>
          </div>
        </div>
      </div>

      {showModal.show && (
        <ModalPopUp
          closeAction={() => {
            setShowModal({show: false, message: '', additional: ''});
          }}
          message={showModal.message.concat(`Additional info -> ${showModal.additional}`)}
        />
      )}
    </>
  );
};

export default ErrorsPage;
