import Modal from '@components/Atoms/Modal';
import {Status} from '@components/Dashboard/Admin/UserManagement/UserStatus';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import InstituteName from '@components/MicroComponents/InstituteName';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listInstitutionsForGraphs} from '@customGraphql/customQueries';

import {updateInstitution} from '@customGraphql/customMutations';
import useDictionary from '@customHooks/dictionary';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {getHostNameFromUrl} from '@utilities/strings';
import {Institution, RoomStatus, UpdateInstitutionInput} from 'API';
import {List, Tooltip} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import PageLayout from 'layout/PageLayout';
import {map} from 'lodash';
import {useState} from 'react';
import InstitutionFormComponent from './InstitutionFormComponent';

interface ServiceProviderListProps {
  id: string;
  postMutation?: (data: any) => void;
}

const ServiceProviderList = ({id}: ServiceProviderListProps) => {
  const {InstitutionDict, userLanguage} = useDictionary();

  const {zoiqFilter} = useGlobalContext();

  const fetchInstitutionLocation = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listInstitutionsForGraphs, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter(
          {
            id: {
              ne: id
            }
          },
          zoiqFilter
        )
      })
    );
    return res.data.listInstitutions.items;
  };

  const onInstitutionUpdate = async () => {
    try {
      let payload: UpdateInstitutionInput = {
        id: institutionForModal.id,
        name: institutionForModal.name,
        type: institutionForModal.type,
        website: institutionForModal.website,
        address: institutionForModal.address,
        addressLine2: institutionForModal.addressLine2,
        city: institutionForModal.city,
        state: institutionForModal.state,
        zip: institutionForModal.zip,
        image: institutionForModal.image,
        isZoiq: institutionForModal.isZoiq,
        phone: institutionForModal.phone,
        isServiceProvider: institutionForModal.isServiceProvider
      };

      const result: any = await API.graphql(
        graphqlOperation(updateInstitution, {
          input: payload
        })
      );

      setInstitutionForModal({...result.data.updateInstitution});
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: institutionList,

    isFetched
  } = useQuery<Institution[]>({
    queryKey: [`institution-list-${id}`],
    queryFn: fetchInstitutionLocation
  });

  const dictionary = InstitutionDict[userLanguage]['TABLE'];

  const [institutionModal, setInstitutionModal] = useState(false);
  const [institutionForModal, setInstitutionForModal] = useState<any>({});

  const onInstitutionClick = (institute: any) => {
    setInstitutionModal(true);
    setInstitutionForModal(institute);
  };

  const {searchInput} = useSearch(institutionList || [], ['name']);
  const {getIndex, allAsProps} = usePagination(
    institutionList || [],
    institutionList?.length || 0
  );

  if (isFetched && institutionList && institutionList.length > 0) {
    const dataList = map(institutionList, (institution, idx) => ({
      markRed: Boolean(institution?.isZoiq),
      onClick: () => institution && onInstitutionClick(institution),
      no: getIndex(idx),
      instituteName: (
        <InstituteName
          searchTerm={searchInput.value}
          name={institution?.name || ''}
          image={institution?.image || ''}
          id={institution?.id || ''}
        />
      ),
      name: institution?.name,
      type: institution?.type || '--',
      website: institution?.website ? getHostNameFromUrl(institution.website) : '--',
      // contactNo: institution?.phone ? formatPhoneNumber(institution.phone) : '--',
      status: <Status useDefault status={institution?.status || RoomStatus.ACTIVE} />,
      rooms: (
        <List
          size="small"
          className="table-list"
          dataSource={institution?.rooms?.items?.filter(
            (d: any) => d.status === RoomStatus.ACTIVE
          )}
          renderItem={(room: any, index: number) => (
            <Tooltip key={room.id} title={`Go to ${room.name}`} placement="left">
              <a
                href={`/dashboard/manage-institutions/institution/${room?.institutionID}/room-edit/${room.id}`}
                onMouseUp={(e) => {
                  e.stopPropagation();
                }}>
                <List.Item className="cursor-pointer hover:underline hover:theme-text:400">
                  {index + 1}. {room.name}
                </List.Item>
              </a>
            </Tooltip>
          )}
        />
      )
      // actions: (
      //   <CommonActionsBtns
      //     button1Label="Edit"
      //     button1Action={() => hand∏leInstitutionView(institution.id)}
      //   />
      // )
    }));

    const tableConfig: ITableProps = {
      headers: [
        'No',
        dictionary['NAME'],
        dictionary['TYPE'],
        dictionary['WEBSITE'],

        'Status',
        'Rooms'
        // dictionary['ACTION']
      ],
      dataList,
      config: {
        dataList: {
          pagination: {
            showPagination: !searchInput.isActive,
            config: {
              allAsProps
            }
          }
        }
      }
    };

    return (
      <PageLayout type="inner" title={InstitutionDict[userLanguage]['TITLE']}>
        <Modal
          width={1000}
          closeOnBackdrop
          closeAction={() => {
            setInstitutionModal(false);
            setInstitutionForModal({});
          }}
          title="Institution Details"
          open={institutionModal}>
          <InstitutionFormComponent
            institutionInfo={institutionForModal}
            postMutation={(data: any) => {
              setInstitutionForModal(data);
            }}
          />
        </Modal>
        <Table {...tableConfig} />
      </PageLayout>
    );
  }
  return null;
};

export default ServiceProviderList;
