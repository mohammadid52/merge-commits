import React, { useEffect, useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api';

import * as queries from '../../../../../graphql/queries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as mutation from '../../../../../graphql/mutations';
import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'
import Selector from '../../../../Atoms/Form/Selector';

interface ServiceProvidersProps {
  instId: string
  serviceProviders: { items: { id: string, providerID: string }[] }
}

const ServiceProviders = (props: ServiceProvidersProps) => {
  const { instId } = props;
  const [servProList, setServProList] = useState();
  const [currentInstituteId, setCurrentInstituteId] = useState('');
  const [activeServPro, setActiveServPro] = useState([]);
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
  const addServiceProvider = () => {
    try {
      const input = {
        partnerID: instId,
        providerID: newServPro.id
      }
      const updatedInstitute: any = API.graphql(graphqlOperation(mutation.createServiceProvider, { input: input }))
    } catch{
      console.log("error adding service providers")
    }
  }

  const deleteServiceProvider = async (id: string) => {
    try {
      const input = {
        id: id
      }
      const list: any = await API.graphql(graphqlOperation(mutation.deleteServiceProvider, { input: input }))
    } catch{

    }
  }
  const fetchServProList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(customQueries.listServiceProviders, {
        filter: {
          isServiceProvider: { eq: true }
        }
      }));
      const filteredList = list.data.listInstitutions?.items.filter((item: { id: string }) => item.id !== instId)
      const sortedList = filteredList.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      const servProList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setServProList(servProList);
    } catch{
      console.log('Error while fetching service providers lists')
    }
  }

  useEffect(() => {
    if (instId) {
      fetchServProList()
    }
  }, [instId])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">SERVICE PROVIDERS</h3>
          <div className="flex items-center w-6/10 m-auto px-2">
            <Selector selectedItem={newServPro.value} list={servProList} placeholder="Add a new service provider" onChange={onServProChange} />
            <Buttons btnClass="ml-4 py-1" label="Add" onClick={addServiceProvider} />
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

            {(activeServPro && activeServPro.length > 0) ? (
              activeServPro.map(item => (
                <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-7/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                    {item.name ? item.name : ''}
                  </div>
                  <span className="w-1/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900" onClick={() => console.log('')}>
                    edit
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
