import Buttons from '@components/Atoms/Buttons';
import PageWrapper from '@components/Atoms/PageWrapper';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listUploadLogs} from '@customGraphql/customQueries';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {ListUploadLogsQueryVariables, UploadLogs} from 'API';
import {orderBy} from 'lodash';
import moment from 'moment';
import {BiCloudDownload} from 'react-icons/bi';
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
    listUploadLogs,
    {limit: SEARCH_LIMIT},
    {
      custom: true,
      enabled: checkIfAdmin(),
      onSuccess: (data) => {
        const orderedList = orderBy([...data], ['createdAt'], ['desc']);
        setData?.([...orderedList]);
      }
    }
  );

  const dataList = data.map((uploadLog, index) => {
    return {
      no: index + 1,
      onClick: () => {},
      uploadDate: moment(uploadLog.Date).format('ll'),
      uploadedBy: (
        <>
          {(uploadLog && uploadLog?.person?.firstName) || ''}{' '}
          {(uploadLog && uploadLog?.person?.lastName) || ''}
        </>
      ),
      classroom: <>{uploadLog?.room?.name || '--'}</>,
      unit: <>{uploadLog?.unit?.name || '--'}</>,
      survey: <>{uploadLog?.lesson?.title || '--'}</>,
      surveyLink: (
        <a href={uploadLog?.urlLink || ''} target="_blank">
          <Buttons
            size="small"
            Icon={BiCloudDownload}
            transparent
            tooltip="Download Csv"
            label={'Download Csv'}
            disabled={!uploadLog.urlLink}
          />
        </a>
      ),
      reasonType: uploadLog.UploadType,
      reason: uploadLog.Reason
    };
  });

  const tableConfig: ITableProps = {
    headers: [
      'No',
      'Upload date',
      'Uploaded by',
      'Classroom',
      'Unit',
      'Survey',
      'Survey Link',
      'Reason type',
      'Reason'
    ],
    dataList,
    config: {
      dataList: {
        loading: isLoading && !isFetched
      }
    }
  };

  return (
    <div className="p-4 pt-8">
      <PageWrapper wrapClass="px-8">
        <SectionTitleV3 title="Upload Logs" />

        <Table {...tableConfig} />
      </PageWrapper>
    </div>
  );
};

export default UploadLogsPage;
