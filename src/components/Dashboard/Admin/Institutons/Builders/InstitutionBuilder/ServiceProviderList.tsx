import InstituteName from '@components/MicroComponents/InstituteName';
import Table, {ITableProps} from '@components/Molecules/Table';

import useDictionary from '@customHooks/dictionary';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {formatPhoneNumber, getHostNameFromUrl} from '@utilities/strings';
import {ServiceProvider} from 'API';
import PageLayout from 'layout/PageLayout';
import {map} from 'lodash';
import {useHistory, useRouteMatch} from 'react-router-dom';

interface ServiceProviderListProps {
  serviceProviders: {
    items: ServiceProvider[];
  };
}

const ServiceProviderList = ({serviceProviders}: ServiceProviderListProps) => {
  const {InstitutionDict, userLanguage} = useDictionary();

  const filtered = serviceProviders?.items?.filter(
    (item) => item?.providerInstitution !== null
  );

  const dictionary = InstitutionDict[userLanguage]['TABLE'];
  const match = useRouteMatch();
  const history = useHistory();

  const handleInstitutionView = (id: string) => {
    history.push(`${match.url}/institution/${id}/edit`);
  };

  const {searchInput} = useSearch(filtered, ['name']);

  const {getIndex, allAsProps} = usePagination(filtered || [], filtered.length || 0);

  const dataList = map(filtered, ({providerInstitution}, idx) => ({
    markRed: Boolean(providerInstitution?.isZoiq),
    onClick: () => providerInstitution && handleInstitutionView(providerInstitution?.id),
    no: getIndex(idx),
    instituteName: (
      <InstituteName
        searchTerm={searchInput.value}
        name={providerInstitution?.name || ''}
        image={providerInstitution?.image || ''}
        id={providerInstitution?.id || ''}
      />
    ),
    name: providerInstitution?.name,
    type: providerInstitution?.type || '--',
    website: providerInstitution?.website
      ? getHostNameFromUrl(providerInstitution.website)
      : '--',
    contactNo: providerInstitution?.phone
      ? formatPhoneNumber(providerInstitution.phone)
      : '--'
    // actions: (
    //   <CommonActionsBtns
    //     button1Label="Edit"
    //     button1Action={() => hand∏leInstitutionView(providerInstitution.id)}
    //   />
    // )
  }));

  const tableConfig: ITableProps = {
    headers: [
      'No',
      dictionary['NAME'],
      dictionary['TYPE'],
      dictionary['WEBSITE'],
      dictionary['CONTACT']
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
    <div>
      <PageLayout title={InstitutionDict[userLanguage]['TITLE']}>
        <Table {...tableConfig} />
      </PageLayout>
    </div>
  );
};

export default ServiceProviderList;
