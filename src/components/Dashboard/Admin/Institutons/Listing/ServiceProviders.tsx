import React, { useEffect, useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api';

import { IoClose } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';

import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'
import Selector from '../../../../Atoms/Form/Selector';

import { createFilterToFetchAllItemsExcept } from '../../../../../utilities/strings';

import * as queries from '../../../../../graphql/queries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as mutation from '../../../../../graphql/mutations';
interface ServiceProvidersProps {
  instId: string
  serviceProviders: { items: { id: string, providerID: string, providerInstitution: any }[] }
  updateInstServiceProviders: Function
}

const ServiceProviders = (props: ServiceProvidersProps) => {
  const { instId, serviceProviders } = props;
  const existingPartners = serviceProviders.items.map((item: any) => {
    return {
      id: item.id,
      partner: { ...item.providerInstitution}
    }
  })
  const [availableServiceProviders, setAvailableServiceProviders] = useState([]);
  const [partners, setPartners] = useState(existingPartners);
  const [newServPro, setNewServPro] = useState({
    id: '',
    name: '',
    value: ''
  });
  const onServProChange = (val: string, name: string, id: string) => {
    setNewServPro({
      id: id,
      name: name,
      value: val
    })
  }
  

  
  const fetchAvailableServiceProviders = async () => {
    try {
      const { serviceProviders: { items } } = props;
      const serviceProvidersIds = items.map((sp: any) => sp.providerID)
      // fetch list of service providers expect the self and partner institutes
      const list: any = await API.graphql(graphqlOperation(customQueries.listServiceProviders, {
        filter: {
          isServiceProvider: { eq: true },
          ...createFilterToFetchAllItemsExcept([instId, ...serviceProvidersIds], 'id')
        }
      }));
      const listItems = list.data.listInstitutions?.items || [];
      // create
      const servProList = listItems.map((item: any, i: any) => ({
        id: item.id,
        name: item.name || '',
        value: item.name || ''
      })).sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      setAvailableServiceProviders(servProList);
    } catch(err){
      console.log('Error while fetching service providers lists', err)
    }
  }

  useEffect(() => {
    if (instId) {
      fetchAvailableServiceProviders()
    }
  }, [instId])

  const addPartner = async () => {
    try {
      if (newServPro && newServPro.id) {
        // get the selected user from the list
        const input = {
          partnerID: instId,
          providerID: newServPro.id
        }
        const addedPartner: any = await API.graphql(graphqlOperation(mutation.createServiceProvider, { input: input }))
        const item = addedPartner.data.createServiceProvider;
        const updatedPartners = [...partners, {id: item.id, partner: { ...item.providerInstitution}}]
        const updatedAvailableServiceProviders = availableServiceProviders.filter((item: any) => item.id !== newServPro.id)
        setNewServPro({ id: '', name: '', value: '' })
        setPartners(updatedPartners)
        setAvailableServiceProviders(updatedAvailableServiceProviders)
      } else {
        // TODO: Add the validation msg or error msg on UI for the service provider.
        // or disable add button if newServPro is not selected 
        console.log('select a service provider to add.')
      }
    } catch (err) {
      console.log('Error: Add partner, service provider builder: Could not add new partner in institution', err)
    }
  }

  const removePartner = async (partner: any) => {
    try {
      const input = { id: partner.id }
      await API.graphql(graphqlOperation(mutation.deleteServiceProvider, { input: input }))
      let updatedPartners = partners.filter((item: any) => item.id !== partner.id)
      setPartners(updatedPartners)
      const updatedAvaiSP = [...availableServiceProviders, { id: partner.id, name: partner.partner.name, value: partner.partner.name }].sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1)
      setAvailableServiceProviders(updatedAvaiSP)
    } catch (err) {
      console.log('Remove partner service provders', err)
    }
  }

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">SERVICE PROVIDERS</h3>
          <div className="flex items-center w-6/10 m-auto px-2">
            <Selector selectedItem={newServPro.value} list={availableServiceProviders} placeholder="Add a new service provider" onChange={onServProChange} />
            <Buttons btnClass="ml-4 py-1" label="Add" onClick={addPartner} />
          </div>


          <div className="my-8 m-auto max-h-88 overflow-y-scroll">

            <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Service Providers</span>
              </div>
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Actions</span>
              </div>
            </div>

            {(partners && partners.length > 0) ? (
              partners.map((item, index) => (
                <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-7/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                    {item.partner.name || ''}
                  </div>
                  <span className="w-1/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900" onClick={() => removePartner(item)}>
                      <IconContext.Provider value={{ size: '1rem', color: '#000000' }}>
                        <IoClose />
                      </IconContext.Provider>
                    </span>
                </div>
              ))
            ) : (<p className="text-center p-16"> No Results</p>)}
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}

export default ServiceProviders;
