import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPlus } from 'react-icons/fa';
import API, { graphqlOperation } from '@aws-amplify/api';

import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import BreadCrums from '../../../Atoms/BreadCrums';
import FormInput from '../../../Atoms/Form/FormInput';
import Selector from '../../../Atoms/Form/Selector';
import Buttons from '../../../Atoms/Buttons';
import * as mutations from '../../../../graphql/mutations';
import * as customMutations from '../../../../customGraphql/customMutations';

interface InstitutionProps {

}

const InstitutionAdd = (props: InstitutionProps) => {

  const history = useHistory();
  const { } = props;
  const initialState = {
    name: '',
    type: '',
    website: '',
    isServiceProvider: '',
    address: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    zip: '',
    phone: '',
    // createdAt: '',
    // updatedAt: '',
    // classes: {},
    // rooms: {},
    // curricula: {},
    // staff: {}
  }
  const [instituteData, setInstituteData] = useState(initialState)
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Institution Management', url: '/dashboard/manage-institutions', last: false },
    { title: 'Add New Institute', url: `/dashboard/manage-institutions/add`, last: true }
  ];
  const institutionTypeList = [
    { id: 1, name: 'School', value: 'school' },
    { id: 2, name: 'After School', value: 'afterSchool' },
    { id: 3, name: 'Day Camp', value: 'institution' },
    { id: 4, name: 'Summer Camp', value: 'status' },
  ]

  const serviceProviderList = [
    { id: 1, name: 'Yes', value: true },
    { id: 2, name: 'No', value: false },
  ]

  const onInputChange = (e: any) => {
    setInstituteData({
      ...instituteData,
      [e.target.name]: e.target.value
    })
  }

  const onTypeSelect = (str: string) => {
    setInstituteData({
      ...instituteData,
      type: str
    });
  }

  const onServiceProSelect = (str: string) => {
    setInstituteData({
      ...instituteData,
      isServiceProvider: str
    });
  }

  const addNewInstitution = async () => {
    // e.preventDefault();
    // Need to add validations
    console.log("Final institute details:", instituteData)
    const newInstitute = await API.graphql(graphqlOperation(customMutations.createInstitution, { input: instituteData }))
    console.log("Final results", newInstitute)
  }

  return (
    <div className="w-full h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Institution" subtitle="Add new institution to the list" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <form>
          <div className="h-full px-6 pb-5 pt-2">
            <div className="text-red-500 pb-2 text-right">* Required fields</div>
            <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">

              {/* General information */}
              <div className="sm:col-span-6 p-6">
                <h3 className="text-lg uppercase leading-6 font-medium text-gray-900"> General Information</h3>
              </div>
              <div className="sm:col-span-3 py-2 pl-8 pr-2">
                <FormInput value={instituteData.name} id='name' name='name' onChange={onInputChange} label="Institution Name" placeHolder="i.e. Iconoclast artist" isRequired />
              </div>
              <div className="sm:col-span-3 py-2 pl-8 pr-2">
                <FormInput value={instituteData.website} id='website' name='website' onChange={onInputChange} label="Website" placeHolder="i.e. Iconoclastartist.com" isRequired />
              </div>
              <div className="sm:col-span-3 py-2 pl-8 pr-2">
                <label className="block text-m font-medium leading-5 mb-2 text-gray-700">
                  <span className="text-red-500"> *</span> Institution Type
                </label>
                <Selector placeholder="Institution Type" selectedItem={instituteData.type} list={institutionTypeList} onChange={onTypeSelect} />
              </div>
              <div className="sm:col-span-3 py-2 pl-8 pr-2">
                <label className="block text-m font-medium leading-5 mb-2 text-gray-700">
                  <span className="text-red-500"> *</span> Is ServiceProvider
                </label>
                <Selector placeholder="Is ServiceProvider" selectedItem={instituteData.isServiceProvider} list={serviceProviderList} onChange={onServiceProSelect} />
              </div>

              {/* Contact Details */}
              <div className="sm:col-span-6 p-6 mt-4">
                <h3 className="text-lg uppercase leading-6 font-medium text-gray-900"> Contact Details</h3>
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.address} id='address' name='address' onChange={onInputChange} label="Address line 1" placeHolder="" isRequired />
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.addressLine2} id='addressLine2' name='addressLine2' onChange={onInputChange} label="Address line 2" placeHolder="" isRequired />
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.city} id='city' name='city' onChange={onInputChange} label="City" placeHolder="" isRequired />
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.district} id='district' name='district' onChange={onInputChange} label="Distict" placeHolder="" isRequired />
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.state} id='state' name='state' onChange={onInputChange} label="State" placeHolder="" isRequired />
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.zip} id='zip' name='zip' onChange={onInputChange} label="Zip" placeHolder="" isRequired />
              </div>
              <div className="sm:col-span-2 py-2 pl-8 pr-2">
                <FormInput value={instituteData.phone} id='phone' name='phone' onChange={onInputChange} label="Contact No." placeHolder="" isRequired />
              </div>

              {/* Actions */}
              <div className="sm:col-span-6 flex justify-end p-6 mt-4">
                <Buttons btnClass="w-auto px-8 py-4" label="save" onClick={addNewInstitution} />
              </div>

            </div>
          </div>
        </form>
      </PageWrapper>

    </div>
  )
}

export default InstitutionAdd
