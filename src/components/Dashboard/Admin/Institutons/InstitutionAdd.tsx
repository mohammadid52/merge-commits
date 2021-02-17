import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import API, { graphqlOperation } from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';

import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import BreadCrums from '../../../Atoms/BreadCrums';
import FormInput from '../../../Atoms/Form/FormInput';
import Selector from '../../../Atoms/Form/Selector';
import CheckBox from '../../../Atoms/Form/CheckBox';
import Buttons from '../../../Atoms/Buttons';
import Loader from '../../../Atoms/Loader';
import * as customMutations from '../../../../customGraphql/customMutations';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import { statesList } from '../../../../utilities/staticData';

const InstitutionAdd = () => {

  const history = useHistory();
  const initialState = {
    id: '',
    name: '',
    type: '',
    website: '',
    isServiceProvider: false,
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    image: ''
  }
  const [instituteData, setInstituteData] = useState(initialState);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState(null);
  const [error, setError] = useState({
    show: true,
    errorMsg: ''
  })

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Institution Management', url: '/dashboard/manage-institutions', last: false },
    { title: 'Add New Institute', url: `/dashboard/manage-institutions/add`, last: true }
  ];
  const institutionTypeList = [
    { id: 1, name: 'School', value: 'School' },
    { id: 2, name: 'After School', value: 'After School' },
    { id: 3, name: 'Day Camp', value: 'Day Camp' },
    { id: 4, name: 'Summer Camp', value: 'Summer Camp' },
    { id: 5, name: '501C3', value: '501C3' },
  ]

  const removeErrorMSg = () => {
    if (error.show) {
      setError({
        show: false,
        errorMsg: ''
      })
    }
  }

  const formValidator = () => {
    if (!instituteData.name) {
      setError({
        show: true,
        errorMsg: 'Institute name is required.'
      })
    }
  }

  const onInputChange = (e: any) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      [e.target.name]: e.target.value
    })
  }

  const onTypeSelect = (str: string, name: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      type: str
    })
  }
  const onStateSelect = (str: string, name: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      state: str
    })
  }

  const handdleCheckBox = () => {
    setInstituteData({
      ...instituteData,
      isServiceProvider: !instituteData.isServiceProvider,
    })
  }
  const cropSelecetedImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setUpImage(fileReader.result)
      }
      fileReader.readAsDataURL(file);
      toggleCropper()
    }
  }

  const toggleCropper = () => {
    setShowCropper(!showCropper)
  }

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`instituteImages/institute_image_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
      }).then(result => {
        console.log('File successfully uploaded to s3', result)
        resolve(true)
      }).catch(err => {
        setError({
          show: true,
          errorMsg: 'Unable to upload image. Please try again later. '
        })
        console.log('Error in uploading file to s3', err)
        reject(err)
      })
    });
  }

  const deletUserProfile = async () => {
    setInstituteData({ ...instituteData, image: '' });
    setImageUrl(null)
  }

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    setS3Image(image)
    const imageUrl = URL.createObjectURL(image)
    setImageUrl(imageUrl);
    setInstituteData({ ...instituteData, image: `instituteImages/institute_image_${instituteData.id}` })
    toggleCropper();
    setImageLoading(false);
  }

  const addNewInstitution = async () => {

    if (!instituteData.name) {
      setError({
        show: true,
        errorMsg: 'Institute name is required.'
      })
    }
    else {
      removeErrorMSg();
      try {
        if (s3Image) {
          await uploadImageToS3(s3Image, instituteData.id, 'image/jpeg')
        }
        const newInstitute = await API.graphql(graphqlOperation(customMutations.createInstitution, { input: instituteData }));
        history.push(`institution?id=${instituteData.id}`)
      } catch{
        setError({
          show: true,
          errorMsg: 'Unable to add new institute. Please try again later.'
        })
      }
    }
  }
  useEffect(() => {
    setInstituteData({
      ...instituteData,
      id: uuidv4()
    })
  }, [])

  const { name, type, website, image, address, addressLine2, city, state, zip, phone, isServiceProvider } = instituteData;

  return (
    <div className="w-full h-full p-4">

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
        <div className="h-9/10 flex flex-col md:flex-row">

          {/* Profile section */}
          <div className="w-2/10 p-4 mr-6 flex flex-col text-center items-center">
            {imageUrl ? (
              <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center mt-4">
                {!imageLoading ? <img
                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full border flex flex-shrink-0 border-gray-400 shadow-elem-light`}
                  src={imageUrl}
                /> :
                  <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-lightI">
                    <Loader />
                  </div>
                }
                <span className="hidden group-focus:flex justify-around mt-6">
                  <label className="w-8 cursor-pointer">
                    <IconContext.Provider value={{ size: '1.6rem', color: '#B22222' }}>
                      <FaEdit />
                    </IconContext.Provider>
                    <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} onClick={(e: any) => e.target.value = ''} accept="image/*" multiple={false} />
                  </label>
                  <span className="w-8 cursor-pointer" onClick={deletUserProfile}>
                    <IconContext.Provider value={{ size: '1.6rem', color: '#fa0000' }}>
                      <FaTrashAlt />
                    </IconContext.Provider>
                  </span>
                </span>
              </button>) :
              <label className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                {!imageLoading ?
                  <IconContext.Provider value={{ size: '3rem', color: '#4a5568' }}>
                    <FaPlus />
                  </IconContext.Provider> :
                  <Loader />}
                <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} onClick={(e: any) => e.target.value = ''} accept="image/*" multiple={false} />
              </label>}
          </div>


          <div className={`h-full w-full pt-2`}>
            {/* FORM submit tag */}
            <form>
              <div className={`h-full shadow-5 bg-white sm:rounded-lg mb-4`}>
                {/* TITLE */}
                <div className='w-full px-4 py-5 border-b border-gray-200 sm:px-6'>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>
                    Institute Information
                  </h3>
                </div>
                {/* FORM */}
                <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6 px-4 py-5'>
                  <div className='sm:col-span-6 px-3 py-4'>
                    <div className="w-3/10">
                      <Selector selectedItem={type} placeholder="Institution Type" list={institutionTypeList} onChange={onTypeSelect} />
                    </div>
                  </div>
                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={name} onChange={onInputChange} id='name' name='name' label="Institution Name" placeHolder="i.e. Iconoclast Artist" isRequired />
                  </div>
                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={website} onChange={onInputChange} id='website' name='website' label="Website(*please enter complete url.) " placeHolder="i.e. https://iconoclastartists.org/" />
                  </div>
                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={address} id='address' onChange={onInputChange} name='address' label="Address line 1" />
                  </div>

                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={addressLine2} id='addressLine2' onChange={onInputChange} name='addressLine2' label="Address line 2" />
                  </div>

                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={city} id='city' onChange={onInputChange} name='city' label="City" />
                  </div>

                  <div className='sm:col-span-3 px-3 py-2'>
                    <label className="block text-xs font-semibold mb-1  leading-5 text-gray-700">
                      State
                    </label>
                    <Selector selectedItem={state} placeholder="Select state" list={statesList} onChange={onStateSelect} />
                  </div>

                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={zip} id='zip' onChange={onInputChange} name='zip' label="Zip" />
                  </div>

                  <div className='sm:col-span-3 px-3 py-2'>
                    <FormInput value={phone} id='phone' onChange={onInputChange} name='phone' label="Phone" />
                  </div>
                  <div className='sm:col-span-3 px-3 py-2 flex items-center'>
                    <CheckBox value={isServiceProvider} onChange={handdleCheckBox} name='isServiceProvider' label="Service Provider" />
                  </div>
                </div>
              </div>

              {error.show ?
                <span className="text-sm text-red-600 my-6 mx-3">{error.errorMsg}</span>
                : null}

              {/* Cancel-save buttons */}
              <div className='px-4 w-full flex justify-end'>
                <div className='flex w-4/10'>
                  <Buttons label="Cancel" btnClass='w-full px-6 py-4 mr-2' onClick={history.goBack} transparent />
                  <Buttons label="Save" btnClass='w-full px-6 py-4 ml-2' onClick={addNewInstitution} />
                </div>
              </div>
            </form>

            {/* Image cropper */}
            {showCropper && (
              <ProfileCropModal upImg={upImage} saveCroppedImage={(img: string) => saveCroppedImage(img)} closeAction={toggleCropper} />
            )}
          </div>

        </div>
      </PageWrapper>

    </div>
  )
}

export default InstitutionAdd
