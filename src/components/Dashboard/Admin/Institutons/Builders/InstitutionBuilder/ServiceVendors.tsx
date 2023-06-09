import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';

import AddButton from 'atoms/Buttons/AddButton';
import Selector from 'atoms/Form/Selector';
import Tooltip from 'atoms/Tooltip';

import {updateServiceProviderStatus} from 'customGraphql/customMutations';
import {listServiceProviders} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {createServiceProvider} from 'graphql/mutations';

import {useGlobalContext} from '@contexts/GlobalContext';
import {getAsset} from 'assets';
import {statusList} from 'utilities/staticData';
import {createFilterToFetchAllItemsExcept} from 'utilities/strings';

interface ServiceVendorsProps {
  instId: string;
  serviceProviders: {
    items: {
      id: string;
      providerID: string;
      status: string;
      providerInstitution?: any;
    }[];
  };
  updateServiceProviders: Function;
  instName: string;
}

const ServiceVendors = (props: ServiceVendorsProps) => {
  const {userLanguage, clientKey, zoiqFilter, theme} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {spBuilderDict, BUTTONS} = useDictionary();
  const dictionary = spBuilderDict[userLanguage];

  const {instId, serviceProviders} = props;
  const [availableServiceProviders, setAvailableServiceProviders] = useState([]);
  const [partners, setPartners] = useState<any>([]);

  const [newServPro, setNewServPro] = useState({id: '', label: '', value: ''});
  const [statusEdit, setStatusEdit] = useState('');
  const [updateStatus, setUpdateStatus] = useState(false);

  useEffect(() => {
    if (!partners.length && serviceProviders.items?.filter((item) => item.id).length) {
      setPartners(
        serviceProviders.items.map((item: any) => ({
          id: item.id,
          status: item.status,
          partner: {...item.providerInstitution}
        }))
      );
    }
  }, [serviceProviders]);

  const onServProChange = (val: string, option: any) => {
    setNewServPro({
      id: option.id,
      label: option.label,
      value: val
    });
  };

  const fetchAvailableServiceProviders = async () => {
    try {
      const {
        serviceProviders: {items}
      } = props;
      const serviceProvidersIds = items.map((sp: any) => sp.providerID);
      // fetch list of service providers expect the self and partner institutes
      const list: any = await API.graphql(
        graphqlOperation(listServiceProviders, {
          filter: {
            isServiceProvider: {eq: true},
            or: [...zoiqFilter],
            ...createFilterToFetchAllItemsExcept([instId, ...serviceProvidersIds], 'id')
          }
        })
      );

      const listItems = list.data.listInstitutions?.items || [];
      // create
      const servProList = listItems
        .map((item: any) => ({
          id: item.id,
          name: item.name || '',
          value: item.name || ''
        }))
        .sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        );
      setAvailableServiceProviders(servProList);
    } catch (err) {
      console.error('Error while fetching service providers lists', err);
    }
  };

  useEffect(() => {
    if (instId) {
      fetchAvailableServiceProviders();
    }
  }, [instId]);

  const addPartner = async () => {
    try {
      if (newServPro && newServPro.id) {
        // get the selected user from the list
        const input = {
          partnerID: instId,
          providerID: newServPro.id,
          status: 'Active'
        };
        const addedPartner: any = await API.graphql(
          graphqlOperation(createServiceProvider, {input: input})
        );
        const item = addedPartner.data.createServiceProvider;
        props.updateServiceProviders(item);
        const updatedPartners = [
          ...partners,
          {
            id: item.id,
            status: 'Active',
            partner: {...item.providerInstitution}
          }
        ];

        const updatedAvailableServiceProviders = availableServiceProviders.filter(
          (item: any) => item.id !== newServPro.id
        );
        setNewServPro({id: '', label: '', value: ''});
        setPartners(updatedPartners);
        setAvailableServiceProviders(updatedAvailableServiceProviders);
      } else {
        // TODO: Add the validation msg or error msg on UI for the service provider.
        // or disable add button if newServPro is not selected
        console.log('select a service provider to add.');
      }
    } catch (err) {
      console.log(
        'Error: Add partner, service provider builder: Could not add new partner in institution',
        err
      );
    }
  };

  const onPartnerStatusChange = async (
    status: string,
    id: string,
    currentStatus: string
  ) => {
    if (currentStatus !== status) {
      setUpdateStatus(true);
      await API.graphql(
        graphqlOperation(updateServiceProviderStatus, {
          input: {id, status}
        })
      );
      const updatedPartners = partners.map((sp: any) => {
        if (sp.id === id) {
          sp.status = status;
        }
        return sp;
      });
      setPartners(updatedPartners);
      setUpdateStatus(false);
    }
    setStatusEdit('');
  };

  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <div className={`h-full mb-4`}>
          {/* TITLE */}
          <div className="w-full px-4 py-5 border-b-0 border-lightest sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-darkest">
              {dictionary.SERVICE}
            </h3>
          </div>
          <div className="flex items-center w-6/10 m-auto px-2 my-8">
            <Selector
              selectedItem={newServPro.value}
              list={availableServiceProviders}
              placeholder={dictionary.ADD_PLACEHOLDER}
              onChange={onServProChange}
            />
            <AddButton
              className="ml-4 py-1"
              label={BUTTONS[userLanguage].ADD}
              onClick={addPartner}
            />
          </div>

          {partners?.length ? (
            <div className="px-4 pb-4">
              <div className="w-full pt-4 m-auto border-b-0 border-light">
                <div className="flex justify-between bg-lightest px-8 whitespace-nowrap">
                  <div className="w-1/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                    <span>{dictionary.NO}</span>
                  </div>
                  <div className="w-4/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                    <span>{dictionary.SERVICE}</span>
                  </div>
                  <div className="w-4/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                    <span>{dictionary.STATUS}</span>
                  </div>
                  <div className="w-1/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                    <span>{dictionary.ACTION}</span>
                  </div>
                </div>
              </div>

              <div className="w-full m-auto max-h-88 overflow-y-auto">
                {partners.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-light">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {index + 1}.
                    </div>
                    <div className="flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal">
                      {item.partner.name || ''}
                    </div>

                    {statusEdit === item.id ? (
                      <div className="w-4/10 mr-6 flex items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                        <Selector
                          selectedItem={item.status}
                          placeholder="Select Status"
                          list={statusList}
                          onChange={(val) =>
                            onPartnerStatusChange(val, item.id, item.status)
                          }
                        />
                      </div>
                    ) : (
                      <div className="w-4/10 flex items-center px-8 py-3 text-left text-s leading-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium  w-auto ${
                            item.status === 'Inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'Dropped'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                          {item.status || 'Active'}
                        </span>
                      </div>
                    )}
                    <div className="w-1/10 flex items-center px-8 py-3 text-left text-s leading-4">
                      {statusEdit === item.id ? (
                        <span
                          className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`}
                          onClick={() => setStatusEdit('')}>
                          {updateStatus ? dictionary.UPDATING : dictionary.CANCEL}
                        </span>
                      ) : (
                        <span
                          className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`}
                          onClick={() => setStatusEdit(item.id)}>
                          <Tooltip text="Click to edit status" placement="left">
                            {BUTTONS[userLanguage].EDIT}
                          </Tooltip>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-16">
              <p> {dictionary.INFO}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceVendors;
