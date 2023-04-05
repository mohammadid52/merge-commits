import Buttons from '@components/Atoms/Buttons';
import Label from '@components/Atoms/Form/Label';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import DotMenu from '@components/TeacherView/ClassRoster/RosterRow/DotMenu';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {logError} from 'graphql-functions/functions';
import {Card, Divider, Popconfirm, Radio, Tooltip} from 'antd';
import {
  ErrorLog,
  ErrorStatus,
  ListErrorLogsQueryVariables,
  UpdateErrorLogInput
} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import {updateErrorLog} from 'customGraphql/customMutations';
import {deleteErrorLog} from 'graphql/mutations';
import {listErrorLogs} from 'graphql/queries';
import {orderBy, update} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Redirect, useHistory} from 'react-router';

const ErrorItem = ({
  error,
  updateStatus,

  setShowModal,

  setMultipleItemsToClose
}: {
  setShowModal: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      additional: string;
      message: string;
    }>
  >;
  // multipleCloseModal: {
  //   show: boolean;
  //   message: string;
  //   onClose: () => void;
  //   onSave: () => void;
  //   cancelAction: () => void;
  // };
  setMultipleItemsToClose: (
    id: string,
    callback: () => void,
    callback2: (data: any[]) => void
  ) => void;
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
      setShowModal({
        show: true,
        message: outputError,
        additional: error.errorType
      });
    }
  };

  const errorStatus = error.status;

  const closedItem = {
    label: 'set to closed',
    action: () => {
      setMultipleItemsToClose(
        error.id,
        () => updateStatus(error.id, ErrorStatus.CLOSED),
        (similarErrorItems) => {
          setMultipleCloseModal({
            show: true,
            message: `Are you sure you want to close all items related to ${
              (error && error.componentName) || ''
            }`,
            onClose: onMultipleCloseModal,
            onSave: () => {
              onMultipleCloseModal();
              similarErrorItems.forEach((d) => {
                updateStatus(d.id, ErrorStatus.CLOSED);
              });
            },
            cancelAction: () => {
              onMultipleCloseModal();
              error?.id && updateStatus(error?.id, ErrorStatus.CLOSED);
            }
          });
        }
      );
    }
  };

  const menuItems =
    errorStatus === ErrorStatus.PENDING
      ? [reviewItem, closedItem, stackItem]
      : errorStatus === ErrorStatus.REVIEW
      ? [pendingItem, closedItem]
      : [pendingItem, reviewItem];

  const history = useHistory();

  const INITIAL_MULTIPLE_CLOSE_MODAL = {
    show: false,
    message: '',
    onClose: () => {},
    onSave: () => {},
    cancelAction: () => {}
  };
  const [multipleCloseModal, setMultipleCloseModal] = useState(
    INITIAL_MULTIPLE_CLOSE_MODAL
  );

  const onMultipleCloseModal = () => {
    setMultipleCloseModal(INITIAL_MULTIPLE_CLOSE_MODAL);
  };

  return (
    <Card
      title={
        <div className="pt-2">
          <Tooltip placement="topLeft" title={error.componentName}>
            <h4 className="mb-0">{error.componentName}</h4>
          </Tooltip>
          <p className=" text-sm text-medium ">{error.email}</p>
        </div>
      }>
      <div className="absolute top-0 w-auto p-4 right-0">
        <DotMenu menuItems={[...menuItems]} />
      </div>

      <h4 className="mb-8 text-sm text-red-600 font-light h-24 overflow-auto py-2">
        {outputError}
      </h4>

      <Divider />
      <div className="absolute w-full left-0  bottom-0 border-t-0 pt-1 border-lightest flex items-center justify-between px-4 py-2">
        <Buttons
          onClick={() => error?.pageUrl && history.push(error?.pageUrl)}
          variant="link"
          size="small"
          label={'Visit url'}
        />
        {errorStatus === ErrorStatus.PENDING && (
          <Popconfirm
            title={'Warning'}
            description={multipleCloseModal.message}
            placement="bottom"
            okText="Yes"
            onConfirm={multipleCloseModal.onSave}
            onCancel={multipleCloseModal.onClose}
            cancelText="No"
            open={multipleCloseModal.show}>
            <Buttons
              onClick={() => closedItem.action()}
              size="small"
              transparent
              variant="dashed"
              label={'Close'}
            />
          </Popconfirm>
        )}
        <p className="mb-0 text-medium  font-light w-auto">
          {moment(error.errorTime).format('lll')}
        </p>
      </div>
    </Card>
  );
};

const deleteClosedErrors = async () => {
  try {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    const res: any = await API.graphql(
      graphqlOperation(listErrorLogs, {
        limit: SEARCH_LIMIT,

        filter: {
          errorTime: {lt: date.toISOString()},
          status: {eq: ErrorStatus.CLOSED}
        }
      })
    );
    const items = res.data.listErrorLogs.items || [];

    if (items && items.length > 0) {
      for (const x of items) {
        await API.graphql(graphqlOperation(deleteErrorLog, {input: {id: x.id}}));
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
    listErrorLogs,
    {
      limit: SEARCH_LIMIT,
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

  const [showModal, setShowModal] = useState({
    show: false,
    message: '',
    additional: ''
  });

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
      await API.graphql(graphqlOperation(updateErrorLog, {input}));
    } catch (error) {
      logError(error, {email, authId}, '@updateStatus');
    }
  };

  const setMultipleItemsToClose = (
    currentId: string,
    callback: () => void,
    callback2: (data: any[]) => void
  ) => {
    const currentItem = data && data.find((d: ErrorLog) => d.id === currentId);

    const similarErrorItems =
      data && currentItem
        ? data.filter(
            (d: ErrorLog) =>
              d.componentName === currentItem?.componentName &&
              d.error === currentItem?.error
          )
        : [];

    if (similarErrorItems && similarErrorItems.length > 0) {
      callback2?.(similarErrorItems);
    } else {
      callback?.();
    }
  };

  const [filters, setFilters] = useState<ErrorStatus | null>(null);

  const updateFilter = (filterName: ErrorStatus, mode: string) => {
    if (filterName === filters) {
      setFilters(null);
      setFilteredList([...data]);
      setMode('');
    } else {
      setMode(mode);
      const filtered = data.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
    }
  };

  const pendingLength = data.filter(
    (_d: ErrorLog) => _d.status === ErrorStatus.PENDING
  ).length;

  const [mode, setMode] = useState('');

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 my-8 inline-block min-w-full sm:px-6 lg:px-8">
            <div>
              <Label label="Filters" />

              <Radio.Group value={mode} style={{marginBottom: 12}}>
                <Radio.Button
                  onClick={() => updateFilter(ErrorStatus.PENDING, 'Pending')}
                  value={'Pending'}>
                  Pending
                </Radio.Button>
                <Radio.Button
                  onClick={() => updateFilter(ErrorStatus.REVIEW, 'Review')}
                  value={'Review'}>
                  Review
                </Radio.Button>
                <Radio.Button
                  onClick={() => updateFilter(ErrorStatus.CLOSED, 'Closed')}
                  value={'Closed'}>
                  Closed
                </Radio.Button>
              </Radio.Group>
            </div>

            <div className="overflow-hidden">
              {isLoading ? null : (
                <h6 className="text-base mb-4 text-darkest   ">
                  {pendingLength} pending errors - total {data.length} errors
                </h6>
              )}

              <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {isLoading &&
                  Array.from({length: 4}).map((_, index) => <Card key={index} loading />)}
                {filteredList.length > 0 ? (
                  filteredList.map((error, idx) => (
                    <ErrorItem
                      // multipleCloseModal={multipleCloseModal}
                      setMultipleItemsToClose={setMultipleItemsToClose}
                      idx={idx}
                      setShowModal={setShowModal}
                      updateStatus={updateStatus}
                      error={error}
                      key={idx}
                    />
                  ))
                ) : isLoading ? null : (
                  <p className="min-h-56 flex items-center w-full justify-center text-medium ">
                    {filters !== undefined
                      ? `No errors found for status - ${filters}`
                      : 'Woahhh.. no errors.'}
                  </p>
                )}
              </div>

              {/* </tbody> */}
              {/* </table> */}
            </div>
          </div>
        </div>
      </div>

      <ModalPopUp
        open={showModal.show}
        closeAction={() => {
          setShowModal({show: false, message: '', additional: ''});
        }}
        message={showModal.message.concat(`Additional info -> ${showModal.additional}`)}
      />
    </>
  );
};

export default ErrorsPage;
